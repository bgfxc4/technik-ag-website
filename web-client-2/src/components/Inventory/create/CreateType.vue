<template>
    <b-button v-b-modal.createTypeModal style="max-height: 6vh">Create Type
        <b-modal size="lg" id="createTypeModal" class="text-secondary" centered hide-footer hide-header-close title="Create Type" header="test" header-class="justify-content-center">
            <div class="modal-body text-center">
                <label for="create-type-name">Name:</label><br/><input id="create-type-name" v-model="typeName" placeholder="Enter a name..."><br/>
                <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.createTypeModal>Cancel</b-button>
                <button class="btn btn-outline-primary" @click="createType">Create Type</button>
            </div>
        </b-modal>
    </b-button>
</template>

<script>
    export default {
        name: "CreateType",
        emits: ['onCreate'],
        props: {
            categoryName: String
        },
        data: function () {
            return  {
                typeName: "",
                errorText: "",
            }
        },
        methods: {
            closeModal () {
                $('#createTypeModal div #closeModalButton').click()
            },
            createType () {
                var type = {
                    name: this.typeName,
                    category: this.categoryName
                }
                this.$store.dispatch("createType", {type, callback: (answ, err) => {
                    if (!answ) {
                        this.errorText = err
                        return
                    } else {
                        this.$emit("onCreate")
                    }
                    this.closeModal()
                }})
            }
        }
    }
</script>

<style scoped>

</style>