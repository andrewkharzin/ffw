<template>
  <div class="overflow-x-hidden">
    <LayoutPageNavbar class="h-[64px] max-h-[64px]" />
    <LayoutPageContent>
      <slot />
      <UNotifications></UNotifications>
    </LayoutPageContent>
    <LayoutPageFooter class="h-[52px] md:h-[42px]" />
  </div>
</template>
