<template>
  <div class="p-4">
    <Card>
      <h2>Book Inventory</h2>
      <Form :model="form" :label-width="80">
        <FormItem label="Title">
          <Input v-model="form.title" />
        </FormItem>
        <FormItem label="Author">
          <Input v-model="form.author" />
        </FormItem>
        <FormItem label="Genre">
          <Select v-model="form.genre" placeholder="Select Genre">
            <Option v-for="g in genres" :key="g" :value="g">{{ g }}</Option>
          </Select>
        </FormItem>
        <FormItem label="Price">
          <Input v-model="form.price" type="number" />
        </FormItem>
        <FormItem label="Stock">
          <Input v-model="form.quantity" type="number" />
        </FormItem>

        <!-- upload image -->
        <FormItem label="Cover">
          <Upload :before-upload="handleImageUpload" :show-upload-list="false">
            <Button icon="ios-cloud-upload-outline">Upload Cover</Button>
            <div v-if="form.cover" style="margin-top: 8px;">
              <img :src="form.cover" alt="cover" style="width: 100px; height: auto;" />
            </div>
          </Upload>
        </FormItem>
        <!-- upload image end -->

        <FormItem>
          <Button type="primary" @click="saveBook">{{ form.id ? 'Update' : 'Add' }}</Button>
          <!-- <Button @click="resetForm" style="margin-left: 8px;">Reset</Button> -->
        </FormItem>
      </Form>
    </Card>

    <Divider />

    <Table :columns="columns" :data="books" border>
      <template #cover="{ row }">
        <div
          style="width: 50px; height: 70px; background: #ccc; display: flex; align-items: center; justify-content: center;">
          <span v-if="!row.cover" style="color: #999; font-size: 14px; text-align: center; word-break: break-word;">No
            Image</span>
          <img v-else :src="row.cover" alt="Cover"
            style="width: 50px; height: 70px; object-fit: contain; border: 1px solid #eee;" />
        </div>
      </template>

      <template #action="{ row }">
        <Button size="small" type="info" @click="editBook(row)">Edit</Button>
        <Button size="small" type="error" @click="deleteBook(row.id)" style="margin-left: 8px;">Delete</Button>
      </template>
    </Table>
  </div>
</template>

<script>
import { supabase } from '@/lib/supabase'

export default {
  name: 'BookInventory',
  data() {
    return {
      form: {
        id: null,
        title: '',
        author: '',
        genre: '',
        price: null,
        quantity: null,
        cover: '' // URL of uploaded image
      },
      books: [],
      genres: ['Horror', 'Comedy', 'Science', 'Romance', 'Fantasy'],
      columns: [
        { title: 'Cover', slot: 'cover', width: 80 }, //uploaded image
        { title: 'Title', key: 'title' },
        { title: 'Author', key: 'author' },
        { title: 'Genre', key: 'genre' },
        { title: 'Price', key: 'price' },
        { title: 'Stock', key: 'quantity' },
        {
          title: 'Action',
          slot: 'action',
          width: 180,
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.fetchBooks()
  },
  methods: {
    async fetchBooks() {
      const { data, error } = await supabase.from('book').select('*').order('created_at', { ascending: true })
      if (!error) this.books = data
    },
    async saveBook() {
      if (this.form.id) {
        // UPDATE HERE
        const { error } = await supabase.from('book').update(this.form).eq('id', this.form.id)
        if (!error) {
          this.$Message.success('Book updated successfully')
          this.fetchBooks()
          this.resetForm()
        }
      } else {
        // ADD HERE
        const form = { ...this.form }
        delete form.id
        const { error } = await supabase.from('book').insert([form])
        if (!error) {
          this.$Message.success('Book added successfully')
          this.fetchBooks()
          this.resetForm()
        }
      }
    },
    editBook(book) {
      console.log(book)
      this.form = { ...book }
      delete this.form._index
      delete this.form._rowKey
    },
    async deleteBook(id) {
      const { error } = await supabase.from('book').delete().eq('id', id)
      if (!error) {
        this.$Message.success('Book deleted successfully')
        this.fetchBooks()
      }
    },
    resetForm() {
      this.form = {
        id: null,
        title: '',
        author: '',
        genre: '',
        price: null,
        quantity: null
      }
    },

    //upload image
    async handleImageUpload(file) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `book-covers/${fileName}`

      const { error } = await supabase.storage.from('bookstore').upload(filePath, file)

      if (!error) {
        const { data } = supabase.storage.from('bookstore').getPublicUrl(filePath)
        this.form.cover = data.publicUrl
        this.$Message.success('Image uploaded')
      } else {
        console.log({ error });

        this.$Message.error('Upload failed')
      }

      // Prevent default upload
      return false
    }
  }
}
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}
</style>
