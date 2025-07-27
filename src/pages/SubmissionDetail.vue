<script setup lang="ts">
import KDialog from '@/components/common/KDialog.vue';
import { Button } from '@/components/ui/button';
import { useLoginStore } from '@/stores/loginStore';
import { useSubmissionLogStore } from '@/stores/submissionLogStore';
import { useSubmissionStore } from '@/stores/submissionStore';
import { LoaderCircle } from 'lucide-vue-next';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';


interface Props {
  id?: string;
}
const props = defineProps<Props>();



const store = useLoginStore()
const submissionStore = useSubmissionStore()
const submissionLogStore = useSubmissionLogStore()
const router = useRouter();

function handleItemLoadError() {
  submissionStore.resetDialog();
  router.push({ name: "dashboard" });  
}

async function initData() {
  if(props.id) {
    await submissionStore.fetchSubmission(props.id );
    submissionStore.formData = {
      company_detail: submissionStore.getData.data,
      shareholders: submissionStore.getData.data.shareholders,
      beneficial_owners: submissionStore.getData.data.beneficial_owners,
      directors: submissionStore.getData.data.directors,
    };

    submissionLogStore.fetchSubmissionLogs(props.id);

    if(submissionStore.getData.error != null && submissionStore.getData.error.trim() != '') {
      submissionStore.dialog.open = true;
      submissionStore.dialog.title = "Error!";
      submissionStore.dialog.message = submissionStore.getData.error;
      submissionStore.dialog.action = handleItemLoadError;
    }
  }
}

onMounted(() => {
    initData();
});
</script>
<template>
    <h2 class="text-white text-4xl w-full text-center mt-14"> Submission {{ props.id }} </h2>
    <div v-if="submissionStore.getData.isLoading" class="w-full mt-8 text-white justify-center items-center flex">
      <LoaderCircle class="me-2 animate-spin" />
      Loading...
    </div>
    <div v-else>
        <div class='text-white mt-8'>{{ submissionStore.formData.company_detail.company_name }}</div>
        <div class='text-white'>{{ submissionStore.formData.company_detail.email }}</div>

        <div class='text-white' v-for="d in submissionLogStore.data" :key="d.id">{{ d.data }}</div>
    </div>
    <KDialog
      :title="submissionStore.dialog.title"
      :message="submissionStore.dialog.message"
      :button="submissionStore.dialog.button"
      :open="submissionStore.dialog.open"
      @close="submissionStore.dialog.action"
    />
</template>