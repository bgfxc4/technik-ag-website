<template>
    <div>
        <div v-if="previewImage || _url" class="imagePreviewWrapper"
            :style="(_url) ? { 'background-image': `url(${_url})` } : { 'background-image': `url(${previewImage})` }">
        </div>
 
        <input
        ref="fileInput"
        type="file"
        @input="pickFile">
    </div>
</template>
 
<script>
    export default {
        name: "ImageUploadPreview",
        props: {
            url: String
        },
        data() {
            return {
                previewImage: null,
                _url: this.url,
            };
        },
        methods: {
            selectImage () {
                this.$refs.fileInput.click()
            },
            pickFile () {
                let input = this.$refs.fileInput
                let file = input.files
                if (file && file[0]) {
                let reader = new FileReader
                reader.onload = e => {
                    this.previewImage = e.target.result
                    this._url = undefined
                }
                reader.readAsDataURL(file[0])
                this.$emit('input', file[0])
                }
            }
        }
    }
</script>
 
<style scoped>
.imagePreviewWrapper {
    width: 250px;
    height: 250px;
    display: block;
    cursor: pointer;
    margin: 0 auto 30px;
    background-size: cover;
    background-position: center center;
    border-radius: 5px;
}
</style>