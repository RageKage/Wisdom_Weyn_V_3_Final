import { ref } from 'vue'
import Swal from 'sweetalert2'
import AppApiService from '../../service/index'

export function submissionFunctions() {
  const service = AppApiService()

  // ref to the child component
  const formVueRef = ref(null)
  const isSent = ref(false)
  const isLoading = ref(false)

  const submitEntry = async (formData) => {
    isLoading.value = true
    isSent.value = false

    // check that all input are valid before submitting, they can't be empty at all
    if (
      !formData.content.trim() ||
      !formData.meaning.trim() ||
      (formData.picked === 'Poetry' && !formData.title.trim())
    ) {
      await Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all fields!',
      })
      isLoading.value = false
      return
    }

    try {
      const response = await service.createSubmission(formData)

      if (response) {
        // reset the form after a delay
        setTimeout(() => {
          // reset the form by sending a reset event to the child component
          formVueRef.value.resetForm()
          isSent.value = true
          isLoading.value = false
        }, 1500)

        setTimeout(() => {
          isLoading.value = false
          isSent.value = false
        }, 2300)
      }
    } catch (error) {
      console.log('server response', error)

      const errorString = error.toString()

      // split string by "-" [0] is title and [1] is message

      const title = errorString.split('-')[0]
      const message = errorString.split('-')[1]

      if (errorString.includes('400')) {
        if (message.includes('User must have a username')) {
          await Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            reverseButtons: true,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Create Username',
          }).then((result) => {
            if (result.isConfirmed) {
              // redirect to the user profile page
              window.location.href = '/custom-username'
            }
          })
        } else {
          await Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            reverseButtons: true,
          })
        }
        isLoading.value = false
        return
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again later.',
        })
        isLoading.value = false
      }
    }
  }

  return {
    formVueRef,
    isSent,
    isLoading,
    submitEntry,
  }
}
