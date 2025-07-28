<script setup lang="ts">
import KDialog from '@/components/common/KDialog.vue';
import { useSubmissionLogStore } from '@/stores/submissionLogStore';
import { useSubmissionStore } from '@/stores/submissionStore';
import { LoaderCircle, Check, Edit } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import DashboardLayout from '@/layouts/DashboardLayout.vue';
import RHeadingSmall from '@/components/RHeadingSmall.vue';
import SubmissionLogUI from '@/components/SubmissionLogUI.vue';
import TextArea from '@/components/ui/textarea/TextArea.vue';
import KTag from '@/components/common/KTag.vue';
import Label from '@/components/ui/label/Label.vue';
import InputError from '@/components/InputError.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';


interface Props {
  id?: string;
}
const props = defineProps<Props>();


const submissionStore = useSubmissionStore()
const submissionLogStore = useSubmissionLogStore()
const router = useRouter();

const isReply = ref(false);

function handleItemLoadError() {
  submissionStore.resetDialog();
  router.push({ name: "dashboard" });  
}

async function initData() {
  if(props.id) {
    await submissionStore.fetchSubmission(props.id );
    
    submissionLogStore.fetchSubmissionLogs(props.id);

    if(submissionStore.getData.error != null && submissionStore.getData.error.trim() != '') {
      submissionStore.dialog.open = true;
      submissionStore.dialog.title = "Error!";
      submissionStore.dialog.message = submissionStore.getData.error;
      submissionStore.dialog.action = handleItemLoadError;
    }

    setTimeout(function() {
      if (col2Ref.value) {
        col2Ref.value.scrollTop = col2Ref.value.scrollHeight;      
      }
    }, 500);
    
  }
}

async function callbackForReject() {
  if(props.id) {
    await submissionStore.submissionReject(props.id);
    submissionLogStore.fetchSubmissionLogs(props.id);    
    setTimeout(function() {
      if (col2Ref.value) {
        col2Ref.value.scrollTop = col2Ref.value.scrollHeight;      
      }
    }, 300);
  }
}
function handleReject() {
  submissionStore.showDialog("Would you like to reject ?", 
  "After you reject the feedback, you will not able to update the submission data again.", 
  callbackForReject, 
  "Continue");
}

async function callbackForAccept() {
  if(props.id) {
    await submissionStore.submissionAccept(props.id);    
    submissionLogStore.fetchSubmissionLogs(props.id);    
    setTimeout(function() {
      if (col2Ref.value) {
        col2Ref.value.scrollTop = col2Ref.value.scrollHeight;      
      }
    }, 300);
  }
}
function handleAccept() {
  submissionStore.showDialog("Would you like to accept ?", 
  "After you accept the feedback, you will not able to update the submission data again. Please make sure your data are updated acoording to the feedback.", 
  callbackForAccept, 
  "Continue");
}
function handleReply() {
  isReply.value = !isReply.value;
  setTimeout(function() {
      if (col2Ref.value) {
        col2Ref.value.scrollTop = col2Ref.value.scrollHeight;      
      }
    }, 100);
}

async function handleReplyNote() {
  if(props.id) {
    
    await submissionStore.submissionReply(props.id);
    isReply.value = !isReply.value;
    
    submissionLogStore.fetchSubmissionLogs(props.id);    
  }
}

const col2Ref = ref<HTMLElement | null>(null);

function handleEdit() {
  router.push({
        name: 'entry', 
        params: { id: props.id } 
    });
}

onMounted(() => {
    initData();    
});

const breadcrumbs: any[] = [
    {
        title: 'Dashboard',
        name: 'dashboard',
        options : {}
    },
    {
        title: 'Edit',
        name: '/',
        options : {}
    },
];

</script>
<template>
  <DashboardLayout>
    <div class="w-full flex flex-col h-full overflow-hidden pt-8 ">
      <Breadcrumbs :breadcrumbs="breadcrumbs" />
      <div v-if="submissionStore.getData == null || submissionStore.getData.isLoading" class=" mt-8 w-full text-center text-gray-400">
        ...
      </div>
      <div v-else>      
        <div class="flex items-center justify-between">
        <div class="shrink-0  flex items-center just mb-4" v-if="submissionStore.getData.data.status != null">
          <h3 class="text-2xl font-bold text-white">
            Submission: {{ submissionStore.getData.data.company_name }}         
          </h3>      
          <KTag :status="submissionStore.getData.data.status" class="ms-2 mt-1"></KTag>
        </div>

        <button class=" w-fit px-4 bg-primary text-white rounded py-2 mb-4 flex items-center" 
          v-if="submissionStore.getData.data.status == 'feedback' 
            || submissionStore.getData.data.status == 'pending'"
          @click="handleEdit">        
            <Edit class="size-4 me-2" /> Edit
        </button>
        </div>

        <div class="flex flex-col md:flex-row gap-6 md:h-[82vh]">
          <!-- Column 1 -->
          <div class="md:w-3/5 overflow-y-auto [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-gray-800
          [&::-webkit-scrollbar-thumb]:bg-gray-900
          p-4 border border-primary-light/25 rounded dark:border-gray-700">
            <div class="space-y-4">

              <RHeadingSmall title="Full Name" :description="submissionStore.getData.data.full_name" />
              <RHeadingSmall title="Email" :description="submissionStore.getData.data.email" class="mt-4" />
              <div class="mt-4 border-b-1 border-primary-light/55 h-0 "/>
              <RHeadingSmall title="Company Name" :description="submissionStore.getData.data.company_name" class="mt-4"/>
              <RHeadingSmall title="Alternative Company Name" :description="submissionStore.getData.data.alternative_company_name ?? ''" class="mt-4"/>
              <RHeadingSmall title="Company designation" :description="submissionStore.getData.data.company_designation?.name ?? ''" class="mt-4"/>
              <RHeadingSmall title="Jurisdiction of Operation" :description="submissionStore.getData.data.jurisdiction_of_operation?.name ?? ''" class="mt-4"/>
              <RHeadingSmall
                  title="Target Jurisdictions"
                  :description="submissionStore.getData.data.target_jurisdiction_names?.map(j => j.name).join(', ') ?? ''"
                  class="mt-4"
              />
              <RHeadingSmall title="Number of Shares" :description="submissionStore.getData.data.number_of_shares?.toString() ?? ''" class="mt-4"/>
              <RHeadingSmall title="Number of Issued Shares" :description="submissionStore.getData.data.number_of_issued_shares?.toString() ?? ''" class="mt-4"/>                        
              <RHeadingSmall 
                  title="Are All Share Issued?" 
                  :description="submissionStore.getData.data.are_all_shares_issued ? 'YES' : 'NO'" 
                  class="mt-4"
              />
              <RHeadingSmall 
                  title="Value Per Shares" 
                  :description="`${submissionStore.getData.data.share_value?.currency ?? ''} ${submissionStore.getData.data.share_value?.amount ?? ''}`.trim()" 
                  class="mt-4"
              />
              <div class="mt-4 border-b-1 border-primary-light/55 h-0 "/>
              <RHeadingSmall 
                  title="Shareholders" 
                  :description="submissionStore.getData.data.shareholders?.map(j => `${j.name ?? '-'}\n${j.email ?? '-'}\n${j.percentage ?? '-'}%`).join('\n\n') ?? ''" 
                  class="mt-4"
                  style="white-space: pre-wrap;"
              />
              <div class="mt-4 border-b-1 border-primary-light/55 h-0 "/>
              <RHeadingSmall 
                  title="Beneficial Owner" 
                  :description="submissionStore.getData.data.beneficial_owners?.map(j => `${j.name ?? '-'}\n${j.email ?? '-'}`).join('\n\n') ?? ''" 
                  class="mt-4"
                  style="white-space: pre-wrap;"
              />
              <div class="mt-4 border-b-1 border-primary-light/55 h-0 "/>
              <RHeadingSmall 
                  title="Directors" 
                  :description="submissionStore.getData.data.directors?.map(j => `${j.name ?? '-'}\n${j.email ?? '-'}}`).join('\n\n') ?? ''" 
                  class="mt-4"
                  style="white-space: pre-wrap;"
              />                    
              <div class="mt-20" />
          
            </div>
          </div>

          <!-- Column 2 -->
          <div ref="col2Ref" class="md:w-2/5 md:overflow-y-auto [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-gray-800
            [&::-webkit-scrollbar-thumb]:bg-gray-900 p-4 border border-dashed border-primary-light/25 dark:border-gray-800 rounded">
            <div class="space-y-4">

              <!-- Load More -->
              <div v-if="submissionLogStore.paginationInfo.current_page < submissionLogStore.paginationInfo.last_page">
                  <p @click="submissionLogStore.fetchSubmissionLogs(props.id ?? '', submissionLogStore.paginationInfo.current_page + 1 )" class=" cursor-pointer text-center w-full font-bold underline ">Load More ...</p>
              </div>

              <!-- Logs -->
              <div class="w-full" v-for="s in submissionLogStore.data " :key="s.id">
                  <SubmissionLogUI :submission-log="s" />
              </div>
              
              <!-- Feedback Status Reply ( Accept, Reject and Reply ) -->
              <div class="flex flex-col items-right justify-right mx-2 mb-8" v-if="submissionStore.getData.data.status == 'feedback'">
                <Label for="note" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2"> Do you accept the feedback ? </Label>
                <div class="flex justify-start">
                  <button
                    variant="default"
                    class="w-fit text-green-700 hover:text-green-500 hover:bg-primary-light/25 border bg-primary-light/5 font-semibold py-1 px-4 rounded-md transition-colors duration-200"
                    @click="handleAccept"
                    :class="isReply ?  'cursor-not-allowed border-gray-600' : 'cursor-pointer border-primary-light/55'">
                    Accept
                  </button>

                  <button
                    variant="default"
                    class="ms-2 w-fit text-rose-700 hover:text-rose-500 hover:bg-primary-light/25 border  bg-primary-light/5 font-semibold py-1 px-4 rounded-md transition-colors duration-200"
                    @click="handleReject"
                    :class="isReply ? 'cursor-not-allowed border-gray-600' : 'cursor-pointer border-primary-light/55'">
                    Reject
                  </button>
                
                  <button
                    variant="default"
                    class="cursor-pointer  ms-2 w-fit text-gray-500 hover:text-gray-300 hover:bg-primary-light/25 border border-gray-600 bg-primary-light/5 font-semibold py-1 px-4 rounded-md transition-colors duration-200"
                    @click="handleReply"
                    :class="isReply ?  ' border-primary-light/55' : 'border-gray-600'">
                    <div class="flex items-center">
                      <Check class='size-4 me-2' v-if="isReply" /> Reply
                    </div>
                  </button>
                </div>  

                <!-- Reply Message -->
                <div v-if="isReply">
                  <Label for="note" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 mt-2">What you want to reply ? </Label>
                        
                  <TextArea
                      id="note"   
                      v-model="submissionStore.reply.note"
                      placeholder="Please write here ..."
                      class="w-full p-2 h-[200px] bg-transparent 
                      border-1 border-primary-light/55
                      focus-visible:border-primary-light"                      
                  />
                  <InputError :message="submissionStore.reply.noteError" />
                  
                  <button class=" w-full mt-4 bg-primary text-white rounded py-2 mb-4" tabindex="5" :disabled="submissionStore.reply.isProcessing" @click="handleReplyNote">
                      <LoaderCircle v-if="submissionStore.reply.isProcessing" class="h-4 w-4 animate-spin" /> 
                      Reply Message
                  </button>
                </div>
              </div>         
            </div>
          </div>
        </div>
      </div>
    </div>
     <KDialog
      :title="submissionStore.dialog.title"
      :message="submissionStore.dialog.message"
      :button="submissionStore.dialog.button"
      v-model:open="submissionStore.dialog.open"
      @close="submissionStore.dialog.action"
    />
  </DashboardLayout>

 
</template>
