<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import ThemeColor from '@/components/ThemeColor.vue'
import M3UResults from '@/components/M3UResults.vue'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import VideoPlayer from '@/components/VideoPlayer.vue'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <header class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>October 2024</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div class="ml-auto px-3">
          <ThemeColor />
        </div>
      </header>
      <div class="flex flex-1 flex-col">
        <M3UResults
          
        />
        <div class="max-h-[90vh]">
          <VideoPlayer />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
