import { ref } from 'vue'
import AppApiService from '../../service/index'

export function submissionFunctions() {
  const service = AppApiService()

  // ref to the child component
  const formVueRef = ref(null)
  const isSent = ref(false)
  const isLoading = ref(false)
  const msgError = ref(null)

  const submitEntry = async (formData) => {
    isLoading.value = true
    isSent.value = false
    msgError.value = null

    // Validate form data upfront
    const isPoetry = formData.picked === 'Poetry'
    if (
      !formData.content.trim() ||
      !formData.meaning.trim() ||
      (isPoetry && !formData.title.trim())
    ) {
      return (msgError.value = 'Please fill in all fields')
    }

    try {
      const response = await service.createSubmission(formData)
      if (response) {
        setTimeout(() => formVueRef.value.resetForm(), 1000)
        setTimeout(() => {
          isLoading.value = false
          isSent.value = false
        }, 1500)
        isSent.value = true
      }
    } catch (error) {
      msgError.value = error
      console.error('Error submitting entry:', error)
    } finally {
      isLoading.value = false // Ensure isLoading is always reset
    }
  }

  return {
    formVueRef,
    isSent,
    isLoading,
    submitEntry,
    msgError,
  }
}
