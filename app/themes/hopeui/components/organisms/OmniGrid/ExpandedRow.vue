<script setup></script>
<template>
    <td v-if="showActions" class="actions text-body">
      <!-- CUSTOM SLOT -->
      <slot v-if="actionLayout === 'custom'" name="custom-actions" :row="row" :actions="actions" />

      <template v-for="action in actions" :key="action.key">
        <slot :name="`${action.key}-icon`" :row="row">
          <font-awesome-icon
            v-if="typeof action.show === 'function' ? action.show(row) : action.show"
            :icon="typeof action.icon === 'function' ? action.icon(row) : action.icon"
            @click="() => action.callback(row)"
            class="icon me-1"
            style="font-size: 1.2rem"
            :class="
              typeof action.colorClass === 'function' ? action.colorClass(row) : action.colorClass
            "
            data-bs-toggle="tooltip"
            :title="typeof action.label === 'function' ? action.label(row) : action.label"
          />
        </slot>
      </template>
    </td>
</template>