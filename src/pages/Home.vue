<template>
  <div class="home">
    <img src="/images/chibi_ahri_blossom.png" class="home__main-icon" />
    <div class="home__content">
      <h1 class="home__content__header">Get Ready for the Fight!</h1>
      <p class="home__content__description">Discover your favourite champions and build your dream team</p>
    </div>
    <router-link to="/build" class="home__action">
      Build Your Team
    </router-link>
  </div>
</template>

<style scoped>
.home {
  @apply flex flex-col justify-center items-center;
}

.home > * {
  @apply mb-4;
}

.home > *:last-child {
  @apply mb-0;
}

.home__main-icon {
  @apply w-32 h-32 object-cover rounded-full;
}

.home__content {
  @apply text-center;
}

.home__content__header {
  @apply mb-2 text-xl md:text-4xl font-semibold;
}

.home__content__description {
  @apply text-xs md:text-base text-secondary;
}

.home__action {
  @apply btn-primary;
}
</style>
