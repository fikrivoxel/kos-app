<template>
  <b-card no-body>
    <b-card-header class="d-flex align-items-center bg-dark text-white">
      <b-link class="text-white" :to="list.id | toLink">
        {{ list.nama }}
      </b-link>
      <button
        class="ml-auto close text-white"
        style="font-size: 1rem;"
        @click="$emit('hapus', list.id)"
      >
        <fa-layers class="fa-fw">
          <fa-icon :icon="['fas', 'times']" />
        </fa-layers>
      </button>
    </b-card-header>
    <b-list-group flush>
      <b-list-group-item>
        Harga: {{ list.harga_default | toRupiah }}
      </b-list-group-item>
      <b-list-group-item> Alamat: {{ list.alamat || "-" }} </b-list-group-item>
    </b-list-group>
    <b-card-footer>
      <b-button
        variant="primary"
        size="sm"
        class="w-100"
        @click="$emit('ganti', list.id)"
      >
        <fa-layers class="fa-fw">
          <fa-icon :icon="['fas', 'edit']" />
        </fa-layers>
        Ganti
      </b-button>
    </b-card-footer>
  </b-card>
</template>

<script>
export default {
  props: {
    list: {
      type: Object,
      default: null
    }
  },
  filters: {
    toLink(id) {
      return `/kos/${id}`;
    },
    toRupiah(number) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
      }).format(number);
    }
  }
};
</script>
