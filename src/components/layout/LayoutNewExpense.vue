<template>
  <div class="w-100 d-flex justify-content-center">
    <button class="btn btn-lg btn-outline-primary w-75" @click=" showModal = true">
      <i class="fa fa-plus"></i>
      Novo Gasto
    </button>

    <form @submit.prevent="submit()">
      <!-- ESCONDENDO O MODAL -->
      <div class="modal fade" :class="{ show : showModal }" :style="{display: showModal ? 'block' : 'none'}">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exemplaModalLiveLabel">Adicionar um novo gasto</h5>
              <button type="button" @click="closeModal()" class="close">
                <span aria-hidden="true">x</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-8">
                  <label for="">Descrição:</label>
                  <input type="text" class="form-control" required v-model="form.description" />
                </div>
                <div class="form-group col-4">
                  <label for="">Valor (R$):</label>
                  <input type="text" class="form-control" required v-model="form.value"/>
                </div>
                <div class="form-group col-12 d-flex flex-column align-items-center">
                  <input ref="input" type="file" class="d-none" accept="image/*" @change="handleFile($event)" />
                  <button type="button" class="btn w-50 btn-outline-secondary" @click="openFileDialog()">
                    Adicionar comprovante
                  </button>

                  <div class="mt-2" v-if="form.receipt">
                    {{ form.receipt.name }}
                    <button type="button" class="btn badge badge-light" @click="form.receipt = ''">
                      <i class="fa fa-trash text-danger"></i>
                    </button>
                  </div>

                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" @click="closeModal()" class="btn btn-secondary">Fechar</button>
              <button class="btn btn-primary" :disabled="loading">
                <template v-if="loading">
                  <i class="fa fa-spin fa-spinner"></i>
                  Incluindo...
                </template>
                <template v-else>
                  Incluir novo gasto
                </template>
                </button>
            </div>
          </div>
        </div>
      </div>
    </form>

    <div class="modal-backdrop fade" :style="{display: showModal ? 'block' : 'none'}"></div>

  </div>

</template>

<script>
export default {
  data: () => ({
    showModal: false,
    loading: false,
    form: {
      receipt: '',
      description: '',
      value: ''
    }
  }),

  computed: {
    fileName() {
      const {receipt} = this.form
        if (receipt) {
          const split = receipt.name.split('.')

          return `${split[0]}-${new Date().getTime()}.${split[1]}`
        } else {
          return ''
        }
    }
  },

  methods: {
    openFileDialog() {
      this.$refs.input.value = null
      this.$refs.input.click()
    },

    handleFile (ev) {
      //console.log(ev);
      this.form.receipt = ev.target.files[0]
    },

    async submit () {
      //console.log('ok');
      let url;

      this.loading = true

      try {
        this.$root.$emit('Spinner::show')

        const ref = this.$firebase.database().ref(window.uid)
        const id = ref.push().key

        //SALVAR IMAGEM SE HOUVER IMAGEM
        if (this.form.receipt) {
          const snapshot = await this.$firebase.storage()
          .ref(window.uid)
          .child(this.fileName)
          .put(this.form.receipt)

          url = await snapshot.ref.getDownloadURL()

        }

        if (!url) {
          url = ''
        }

        const payload = {
          id,
          recipt: url,
          value: this.form.value,
          createdAt: new Date().getTime(),
          description: this.form.description
        }

        //console.log(payload)

        ref.child(id).set(payload, err => {
          if (err) {
            this.$root.$emit('Notification::show', {
              type: 'danger',
              message:  'Nao foi possivel inserir o gasto, tente nvamente1'
            })
            console.error(err)
            this.loading = false

          } else {
            this.$root.$emit('Notification::show', {
              type: 'success',
              message: 'Gasto inserido com sucesso'
            })
            this.closeModal()
            this.loading = false
          }
        })

      } catch (err) {
        //console.error(err)

        this.$root.$emit('Notification::show', {
              type: 'danger',
              message: 'Nao foi possivel inserir o gasto'
            })

      } finally {
        this.$root.$emit('Spinner::hide')

      this.loading = false
      }


    },

    closeModal () {
      this.showModal = false;
    }

  }

}
</script>

<style scoped lang="scss">
.modal {
  color: var(--dark);
}
</style>
