<template>
  <div class="date-picker">
    <label :for="id" class="date-label">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :value="formattedValue"
      @input="handleInput"
      :required="required"
      :min="min"
      :max="max"
      class="date-input"
    />
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  id: {
    type: String,
    default: 'date-input'
  },
  label: {
    type: String,
    default: 'Date'
  },
  type: {
    type: String,
    default: 'date',
    validator: (value) => ['date', 'datetime-local'].includes(value)
  },
  modelValue: {
    type: [String, Date],
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  min: {
    type: String,
    default: ''
  },
  max: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const error = ref('')

const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  
  if (props.modelValue instanceof Date) {
    if (props.type === 'datetime-local') {
      return props.modelValue.toISOString().slice(0, 16)
    } else {
      return props.modelValue.toISOString().split('T')[0]
    }
  }
  
  return props.modelValue
})

const handleInput = (event) => {
  const value = event.target.value
  
  if (value) {
    const date = new Date(value)
    
    // Validate min date
    if (props.min && date < new Date(props.min)) {
      error.value = `Date must be after ${new Date(props.min).toLocaleDateString()}`
      return
    }
    
    // Validate max date
    if (props.max && date > new Date(props.max)) {
      error.value = `Date must be before ${new Date(props.max).toLocaleDateString()}`
      return
    }
    
    error.value = ''
  }
  
  emit('update:modelValue', value)
}

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    error.value = ''
  }
})
</script>

<style scoped>
.date-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-label {
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.date-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s;
}

.date-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.date-input:invalid {
  border-color: var(--danger-color);
}

.error-message {
  font-size: 0.875rem;
  color: var(--danger-color);
  margin-top: 0.25rem;
}
</style>