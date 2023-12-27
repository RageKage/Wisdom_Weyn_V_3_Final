<template>
  <div>
    <div>
      <formVue @submit="submitEntry" ref="formVueRef" :is-loading="isLoading" />
      <p v-if="isSent" role="alert">Your submission has been sent!</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getFunctions, httpsCallable } from "firebase/functions";
import Swal from "sweetalert2";

// import child component
import formVue from "@/components/Views/form.vue";

import { submissionFunctions } from "../Composables/SubmitProverb";

const { formVueRef, isSent, isLoading, submitEntry } = submissionFunctions();
</script>
