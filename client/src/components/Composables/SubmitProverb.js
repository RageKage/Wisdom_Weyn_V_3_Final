import { ref } from "vue";
import Swal from "sweetalert2";
import AppApiService from "../../service/index";

export function submissionFunctions() {
  const service = AppApiService();

  // ref to the child component
  const formVueRef = ref(null);
  const isSent = ref(false);
  const isLoading = ref(false);

  const submitEntry = async (formData) => {
    isLoading.value = true;
    isSent.value = false;

    // check that all input are valid before submitting, they can't be empty at all
    if (
      !formData.content.trim() ||
      !formData.meaning.trim() ||
      (formData.picked === "Poetry" && !formData.title.trim())
    ) {
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please fill in all fields!",
      });
      isLoading.value = false;
      return;
    }

    try {
      console.log("Submitting data:", formData);
      const response = await service.createSubmission(formData);

      if (response) {
        // reset the form after a delay
        setTimeout(() => {
          // reset the form by sending a reset event to the child component
          formVueRef.value.resetForm();
          isSent.value = true;
          isLoading.value = false;
        }, 2500);

        setTimeout(() => {
          isLoading.value = false;
          isSent.value = false;
        }, 3300);
      }
    } catch (error) {
      // check if error contains the msg "You must be logged in to create a submission"
      if (error.includes("You must be logged in to create a submission")) {
        await Swal.fire({
          title: "Login Required",
          text: "You must be logged in to create a submission",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Login",
          cancelButtonText: "Cancel",
          reverseButtons: true,
          customClass: {
            popup: "flex flex-col space-y-4",
            header: "flex items-center justify-between w-full",
            closeButton: "text-gray-400 hover:text-gray-500 ml-auto",
            content: "text-gray-700 prose",
            actions: "flex justify-end gap-4 mt-4",
          },
        });
        isLoading.value = false;
        return;
      } else {
        await Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        isLoading.value = false;
      }
    }
  };

  return {
    formVueRef,
    isSent,
    isLoading,
    submitEntry,
  };
}
