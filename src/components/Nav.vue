<script lang="ts" setup>
import { Icon } from '@iconify/vue'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useM3UStore } from '../useM3UStore'

const {  selectPlaylist} = useM3UStore()


export interface LinkProp {
  id: string
  name: string
  label?: string
  icon?: string
  variant?: 'default' | 'ghost'
}

interface NavProps {
  isCollapsed: boolean
  links: LinkProp[]
}

defineProps<NavProps>()
</script>

<template>
  <div
    :data-collapsed="isCollapsed"
    class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
  >
    <nav class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
      <template v-for="(link, index) of links">
        <Tooltip v-if="isCollapsed" :key="`1-${index}`" :delay-duration="0">
          <TooltipTrigger as-child>
            <a
              href="#"
              :class="cn(
                buttonVariants({ variant: 'ghost', size: 'icon' }),
                'h-9 w-9'
              )"
              @click="selectPlaylist(link.id)"
            >
              <Icon icon="lucide:tv" class="size-4" />
              <span class="sr-only">{{ link.name }}</span>
            </a>
          </TooltipTrigger>
          <TooltipContent side="right" class="flex items-center gap-4">
            {{ link.name }} ff
          </TooltipContent>
        </Tooltip>

        <a
          v-else
          :key="`2-${index}`"
          href="#"
          :class="cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'justify-start',
          )"
          @click="selectPlaylist(link.id)"
        >
          <Icon icon="lucide:tv" class="mr-2 size-4" />
          {{ link.name }}
        </a>
      </template>
    </nav>
  </div>
</template>