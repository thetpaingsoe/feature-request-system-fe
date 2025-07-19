<script setup lang="ts">
import InputError from '@/components/InputError.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'
import TextArea from '@/components/ui/textarea/TextArea.vue'
import { LoaderCircle } from 'lucide-vue-next'
import { useFeatureRequestStore } from '@/stores/featureRequestStore'

const store = useFeatureRequestStore()

async function submit() {
  store.startProcessing()

  if (store.validate()) {
    console.log('success')
    await store.submitFeatureRequest()
  }

  store.endProcessing()
}
</script>

<template>
  <div
    class="flex flex-row my-32 flex-1 bg-white rounded-2xl shadow-2xl mx-4 md:mx-4 min-h-[700px]"
  >
    <!-- Left Panel -->
    <div class="bg-gray-600 flex-1/2 w-full h-auto rounded-s-2xl relative hidden md:inline">
      <!-- Image -->
      <img
        src="../assets/request.png"
        class="w-full h-full object-cover rounded-s-2xl hidden md:inline"
      />
      <div class="bg-black w-full h-full absolute top-0 left-0 opacity-50 rounded-s-2xl"></div>
    </div>

    <!-- Right Panel -->
    <div class="space-y-6 flex-1/2 px-4 py-8 md:p-8">
      <!-- Header -->
      <div class="grid gap-2">
        <Label class="text-2xl">Feature Request Form</Label>
        <Label class="text-gray-500 text-sm/6 md:font-normal"
          >Submit your innovative ideas and suggestions to help us improve.
        </Label>
      </div>

      <!-- Title -->
      <div class="grid gap-2">
        <Label for="email">Title</Label>
        <Input
          id="title"
          type="text"
          name="title"
          autocomplete="off"
          v-model="store.form.title"
          autofocus
          placeholder="Enter Title"
        />
        <InputError :message="store.formError.title" />
      </div>

      <!-- Email -->
      <div class="grid gap-2">
        <Label for="email">Email</Label>
        <Input
          id="email"
          type="email"
          name="email"
          autocomplete="off"
          v-model="store.form.email"
          autofocus
          placeholder="Enter Email Address"
        />
        <InputError :message="store.formError.email" />
      </div>

      <!-- Description -->
      <div class="grid gap-2">
        <Label for="email">Description</Label>
        <TextArea
          id="description"
          type="text"
          name="description"
          autocomplete="off"
          v-model="store.form.description"
          autofocus
          placeholder="Enter Description"
        />
        <InputError :message="store.formError.description" />
      </div>

      <InputError
        :message="store.formError.server"
        class="h-10 bg-red-100 px-3 content-center rounded font-normal"
      />
      <!-- Submit Button -->
      <div class="my-6 flex items-center justify-start">
        <Button class="w-full" :disabled="store.processing" @click="submit">
          <LoaderCircle v-if="store.processing" class="h-4 w-4 animate-spin" />
          Submit Form
        </Button>
      </div>
    </div>
  </div>
</template>
