<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useRouter } from 'vue-router';

interface BreadcrumbItemType {
    title: string;
    name?: string;
    options?: any;
}

defineProps<{
    breadcrumbs: BreadcrumbItemType[];
}>();
const router = useRouter();
function handleLinkClick(name : string, options : {}) {
    if(name != ''){
        router.push({name : name, params : options, });
    }
}
</script>

<template>
    <Breadcrumb>
        <BreadcrumbList>
            <template v-for="(item, index) in breadcrumbs" :key="index">
                <BreadcrumbItem>
                    <template v-if="index === breadcrumbs.length - 1">
                        <BreadcrumbPage>{{ item.title }}</BreadcrumbPage>
                    </template>
                    <template v-else>
                        <BreadcrumbLink as-child >
                            <div @click="handleLinkClick(item.name ?? '',item.options)" class=" cursor-pointer hover:text-primary">{{ item.title }}</div>
                        </BreadcrumbLink>
                    </template>
                </BreadcrumbItem>
                <BreadcrumbSeparator v-if="index !== breadcrumbs.length - 1" />
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
