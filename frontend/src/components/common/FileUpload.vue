<template>
  <div class="file-upload">
    <input
      type="file"
      :id="id"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
      ref="fileInput"
      class="file-input"
    />
    
    <label :for="id" class="upload-area" :class="{ 'dragover': isDragging }"
           @dragenter.prevent="isDragging = true"
           @dragleave.prevent="isDragging = false"
           @dragover.prevent
           @drop.prevent="handleDrop">
      <div class="upload-content">
        <div class="upload-icon">📎</div>
        <div class="upload-text">
          <p v-if="!selectedFiles.length">{{ placeholder }}</p>
          <p v-else>
            {{ selectedFiles.length }} file{{ selectedFiles.length > 1 ? 's' : '' }} selected
          </p>
          <p class="upload-hint">Click to browse or drag and drop</p>
        </div>
      </div>
    </label>
    
    <div v-if="selectedFiles.length > 0" class="file-list">
      <div v-for="(file, index) in selectedFiles" :key="index" class="file-item">
        <div class="file-info">
          <span class="file-icon">{{ getFileIcon(file.type) }}</span>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button @click="removeFile(index)" class="remove-btn" type="button">×</button>
      </div>
    </div>
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: 'file-upload'
  },
  accept: {
    type: String,
    default: '.pdf,.doc,.docx,.txt,.zip'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Choose a file or drag it here'
  },
  maxSize: {
    type: Number,
    default: 16 * 1024 * 1024 // 16MB
  },
  modelValue: {
    type: [File, Array],
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const fileInput = ref(null)
const selectedFiles = ref([])
const isDragging = ref(false)
const error = ref('')

const getFileIcon = (fileType) => {
  if (fileType.includes('pdf')) return '📄'
  if (fileType.includes('word') || fileType.includes('document')) return '📝'
  if (fileType.includes('text')) return '📃'
  if (fileType.includes('zip')) return '📦'
  return '📎'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const validateFiles = (files) => {
  error.value = ''
  
  // Check file count
  if (!props.multiple && files.length > 1) {
    error.value = 'Only one file is allowed'
    return false
  }
  
  // Check file size
  for (const file of files) {
    if (file.size > props.maxSize) {
      error.value = `File ${file.name} is too large. Maximum size is ${formatFileSize(props.maxSize)}`
      return false
    }
  }
  
  // Check file extensions
  const allowedExtensions = props.accept.split(',').map(ext => ext.trim().toLowerCase())
  for (const file of files) {
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    if (!allowedExtensions.includes(fileExtension)) {
      error.value = `File type not allowed: ${fileExtension}. Allowed: ${props.accept}`
      return false
    }
  }
  
  return true
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  if (!files.length) return
  
  if (validateFiles(files)) {
    if (props.multiple) {
      selectedFiles.value = [...selectedFiles.value, ...files]
    } else {
      selectedFiles.value = [files[0]]
    }
    emitFiles()
  }
  
  // Reset input
  fileInput.value.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer.files)
  
  if (validateFiles(files)) {
    if (props.multiple) {
      selectedFiles.value = [...selectedFiles.value, ...files]
    } else {
      selectedFiles.value = [files[0]]
    }
    emitFiles()
  }
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
  emitFiles()
}

const emitFiles = () => {
  if (props.multiple) {
    emit('update:modelValue', selectedFiles.value)
  } else {
    emit('update:modelValue', selectedFiles.value[0] || null)
  }
  emit('error', error.value)
}

const clearFiles = () => {
  selectedFiles.value = []
  emitFiles()
}

// Watch for external modelValue changes
watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    selectedFiles.value = []
  }
})

defineExpose({
  clearFiles
})
</script>

<style scoped>
.file-upload {
  width: 100%;
}

.file-input {
  display: none;
}

.upload-area {
  display: block;
  width: 100%;
  padding: 3rem 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  background-color: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background-color: #f3f4f6;
}

.upload-area.dragover {
  border-color: var(--primary-color);
  background-color: #eef2ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.upload-icon {
  font-size: 3rem;
  opacity: 0.6;
}

.upload-text p {
  margin: 0;
  color: var(--text-secondary);
}

.upload-hint {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

.file-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.file-icon {
  font-size: 1.5rem;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.file-size {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--danger-color);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.remove-btn:hover {
  color: #b91c1c;
}

.error-message {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
</style>