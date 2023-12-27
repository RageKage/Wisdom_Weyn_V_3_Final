import { ref } from "vue";
import { getFunctions, httpsCallable } from "firebase/functions";
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
        text: "Please fill in all fields! 2",
      });
      isLoading.value = false;
      return;
    }

    try {
      console.log("Submitting data:", formData);
      const response = await service
        .createSubmission(formData)
        .then((response) => {
          if (response.success) {
            isSent.value = true;

            // reset the form after few milliseconds
            setTimeout(() => {
              // reset the form by sending a reset event to the child component
              formVueRef.value.resetForm();
              isSent.value = false;
              isLoading.value = false;
            }, 2500);

            setTimeout(() => {
              isLoading.value = false;
            }, 3300);

            console.log("Looks good to me");
          }
        })
        .catch((error) => {
          console.error("Error submitting data:", error);
        });
    } catch (error) {
      console.error(error);
      await Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      isLoading.value = false;
    } finally {
      isLoading.value = false;
    }
  };

  return {
    formVueRef,
    isSent,
    isLoading,
    submitEntry,
  };
}
