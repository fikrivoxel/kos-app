<template>
  <router-view />
</template>

<route>
{
  "meta": {
    "middleware": ["isauth"]
  }
}
</route>
