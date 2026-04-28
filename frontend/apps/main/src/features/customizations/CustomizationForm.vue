<template>
  <Spinner v-if="formLoading"></Spinner>
  <form @submit="onSubmit" class="space-y-6 w-full" :class="{ 'opacity-50': formLoading }">
    <FormField v-slot="{ componentField }" name="title">
      <FormItem>
        <FormLabel>{{ t('customizations.form.title') }}</FormLabel>
        <FormControl>
          <Input type="text" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="description">
      <FormItem>
        <FormLabel>{{ t('customizations.form.description') }}</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" rows="3" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="type">
      <FormItem>
        <FormLabel>{{ t('customizations.form.type') }}</FormLabel>
        <FormControl>
          <Select v-bind="componentField">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="page">{{ t('customizations.types.page') }}</SelectItem>
                <SelectItem value="component">{{ t('customizations.types.component') }}</SelectItem>
                <SelectItem value="extension">{{ t('customizations.types.extension') }}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="active">
      <FormItem class="flex flex-row items-center justify-between rounded-lg border p-4">
        <div class="space-y-0.5">
          <FormLabel>{{ t('customizations.form.active') }}</FormLabel>
        </div>
        <Switch :checked="form.values.active" @update:checked="form.setFieldValue('active', $event)" />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="config">
      <FormItem>
        <FormLabel>{{ t('customizations.form.config') }}</FormLabel>
        <FormControl>
          <Textarea v-bind="componentField" rows="5" placeholder="{}" />
        </FormControl>
        <FormDescription>{{ t('customizations.form.config.description') }}</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" :isLoading="isLoading">{{ submitLabel }}</Button>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { Button } from '@shared-ui/components/ui/button'
import { Spinner } from '@shared-ui/components/ui/spinner'
import { Input } from '@shared-ui/components/ui/input'
import { Textarea } from '@shared-ui/components/ui/textarea'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@shared-ui/components/ui/form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@shared-ui/components/ui/select'
import { Switch } from '@shared-ui/components/ui/switch'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'

const { t } = useI18n()
const formLoading = ref(false)
const props = defineProps({
  initialValues: {
    type: Object,
    default: () => ({})
  },
  submitForm: {
    type: Function,
    required: true
  },
  submitLabel: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const submitLabel = computed(() => {
  return (
    props.submitLabel ||
    (props.initialValues.id ? t('globals.messages.save') : t('globals.messages.create'))
  )
})

const formSchema = toTypedSchema(
  z.object({
    title: z
      .string({ required_error: t('globals.messages.required') })
      .min(2, { message: t('customizations.form.title.min') })
      .max(140, { message: t('customizations.form.title.max') }),
    description: z.string().optional().default(''),
    type: z.enum(['page', 'component', 'extension']),
    active: z.boolean().default(true),
    config: z.string().optional().default('{}')
  })
)

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    active: props.initialValues.active ?? true,
    type: props.initialValues.type || 'page',
    config: JSON.stringify(props.initialValues.config || {}, null, 2)
  }
})

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const config = JSON.parse(values.config || '{}')
    const payload = {
      ...values,
      config
    }
    props.submitForm(payload)
  } catch {
    form.setFieldError('config', t('customizations.form.config.invalid'))
  }
})

watch(
  () => props.initialValues,
  (newValues) => {
    if (!newValues || Object.keys(newValues).length === 0) return
    form.setValues({
      title: newValues.title || '',
      description: newValues.description || '',
      type: newValues.type || 'page',
      active: newValues.active ?? true,
      config: JSON.stringify(newValues.config || {}, null, 2)
    })
  },
  { immediate: true }
)
</script>