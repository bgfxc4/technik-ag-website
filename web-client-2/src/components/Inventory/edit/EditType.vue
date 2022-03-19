<template>
    <b-modal size="lg" id="editTypeModal" class="text-secondary" centered hide-footer scrollable hide-header-close title="Edit Type" header="test" header-class="justify-content-center">
        <div class="modal-body text-center">
            <label for="edit-type-name">Name:</label><br/><input id="edit-type-name" v-model="typeName" placeholder="Enter a name..."><br/>
            <b-button id="closeModalButton" class="btn btn-secondary" v-b-modal.editTypeModal>Cancel</b-button>
            <button class="btn btn-outline-primary" @click="editType">Edit Type</button>
        </div>
    </b-modal>
</template>

<script>
    export default {
        name: "EditType",
        emits: ['onEdit'],
        props: {
            type: Object,
            catName: String
        },
        data: function () {
            return  {
                typeName: "",
                errorText: "",
            }
        },
        watch: {
            type(n) {
                if (n != {} && n != undefined)
                    this.fillInType()
            }
        },
        methods: {
            closeModal () {
                $('#editTypeModal div #closeModalButton').click()
            },
            editType () {
                var type = {
                    old_name: this.type.name,
                    new_name: this.typeName,
                    category: this.catName
                }
                this.$store.dispatch("editType", {type, callback: (answ, err) => {
                    if (!answ) {
                        this.errorText = err
                        return
                    } else {
                        this.$emit("onEdit")
                    }
                    this.closeModal()
                }})
            },
            fillInType () {
                console.log(this.type)
                this.typeName = this.type.name
            }
        }
    }
</script>

<style scoped>

</style>