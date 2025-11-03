import { toast } from 'react-toastify'

class PenService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  ensureClient() {
    if (!this.apperClient) {
      this.initializeClient()
    }
    return this.apperClient
  }

  // Transform database record to application format
  transformFromDatabase(dbRecord) {
    if (!dbRecord) return null
    
    return {
      Id: dbRecord.Id,
      title: dbRecord.title_c || dbRecord.Name || "Untitled Pen",
      html: dbRecord.html_c || "",
      css: dbRecord.css_c || "",
      javascript: dbRecord.javascript_c || "",
      thumbnail: dbRecord.thumbnail_c || null,
      author: {
        name: dbRecord.author_name_c || "Anonymous",
        avatar: dbRecord.author_avatar_c || null,
        id: dbRecord.author_id_c || "anonymous"
      },
      views: dbRecord.views_c || 0,
      likes: dbRecord.likes_c || 0,
      createdAt: dbRecord.createdOn_c || dbRecord.CreatedOn,
      updatedAt: dbRecord.updatedAt_c || dbRecord.ModifiedOn,
      tags: dbRecord.Tags ? dbRecord.Tags.split(',').map(tag => tag.trim()) : []
    }
  }

  // Transform application data to database format
  transformToDatabase(appData) {
    const dbData = {}
    
    if (appData.title !== undefined) dbData.title_c = appData.title
    if (appData.html !== undefined) dbData.html_c = appData.html
    if (appData.css !== undefined) dbData.css_c = appData.css
    if (appData.javascript !== undefined) dbData.javascript_c = appData.javascript
    if (appData.thumbnail !== undefined) dbData.thumbnail_c = appData.thumbnail
    if (appData.author?.name !== undefined) dbData.author_name_c = appData.author.name
    if (appData.author?.avatar !== undefined) dbData.author_avatar_c = appData.author.avatar
    if (appData.author?.id !== undefined) dbData.author_id_c = appData.author.id
    if (appData.views !== undefined) dbData.views_c = appData.views
    if (appData.likes !== undefined) dbData.likes_c = appData.likes
    if (appData.createdAt !== undefined) dbData.createdOn_c = appData.createdAt
    if (appData.updatedAt !== undefined) dbData.updatedAt_c = appData.updatedAt
    if (appData.tags && Array.isArray(appData.tags)) dbData.Tags = appData.tags.join(', ')
    
    // Always include Name field as it's typically required
    if (appData.title !== undefined) dbData.Name = appData.title
    
    return dbData
  }

  async getAll() {
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "createdOn_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await client.fetchRecords('pens_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return (response.data || []).map(record => this.transformFromDatabase(record))
    } catch (error) {
      console.error("Error fetching pens:", error)
      toast.error("Failed to load pens")
      return []
    }
  }

  async getById(id) {
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "createdOn_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      }

      const response = await client.getRecordById('pens_c', parseInt(id), params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return this.transformFromDatabase(response.data)
    } catch (error) {
      console.error("Error fetching pen:", error)
      return null
    }
  }

  async getTrending() {
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "createdOn_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        // Note: Complex sorting by (likes_c + views_c) would require aggregation
        // For now, sort by likes_c as primary indicator
        orderBy: [{"fieldName": "likes_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 10, "offset": 0}
      }

      const response = await client.fetchRecords('pens_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      const pens = (response.data || []).map(record => this.transformFromDatabase(record))
      
      // Sort by combined popularity score client-side
      return pens.sort((a, b) => (b.likes + b.views) - (a.likes + a.views))
    } catch (error) {
      console.error("Error fetching trending pens:", error)
      toast.error("Failed to load trending pens")
      return []
    }
  }

  async search(query, options = {}) {
    if (!query.trim()) return []
    
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      const { sortBy = "recent", filterBy = "all" } = options
      const searchTerm = query.toLowerCase()

      // Build where conditions based on filter type
      let where = []
      
      switch (filterBy) {
        case "title":
          where = [{"FieldName": "title_c", "Operator": "Contains", "Values": [query], "Include": true}]
          break
        case "author":
          where = [{"FieldName": "author_name_c", "Operator": "Contains", "Values": [query], "Include": true}]
          break
        case "tags":
          where = [{"FieldName": "Tags", "Operator": "Contains", "Values": [query], "Include": true}]
          break
        case "all":
        default:
          // Use whereGroups for OR logic across multiple fields
          const whereGroups = [{
            "operator": "OR",
            "subGroups": [
              {
                "conditions": [
                  {"fieldName": "title_c", "operator": "Contains", "values": [query]}
                ],
                "operator": ""
              },
              {
                "conditions": [
                  {"fieldName": "author_name_c", "operator": "Contains", "values": [query]}
                ],
                "operator": ""
              },
              {
                "conditions": [
                  {"fieldName": "Tags", "operator": "Contains", "values": [query]}
                ],
                "operator": ""
              }
            ]
          }]
          
          const params = {
            fields: [
              {"field": {"Name": "Id"}},
              {"field": {"Name": "Name"}},
              {"field": {"Name": "Tags"}},
              {"field": {"Name": "title_c"}},
              {"field": {"Name": "html_c"}},
              {"field": {"Name": "css_c"}},
              {"field": {"Name": "javascript_c"}},
              {"field": {"Name": "thumbnail_c"}},
              {"field": {"Name": "author_name_c"}},
              {"field": {"Name": "author_avatar_c"}},
              {"field": {"Name": "author_id_c"}},
              {"field": {"Name": "views_c"}},
              {"field": {"Name": "likes_c"}},
              {"field": {"Name": "createdOn_c"}},
              {"field": {"Name": "updatedAt_c"}},
              {"field": {"Name": "CreatedOn"}},
              {"field": {"Name": "ModifiedOn"}}
            ],
            whereGroups: whereGroups,
            pagingInfo: {"limit": 50, "offset": 0}
          }

          const response = await client.fetchRecords('pens_c', params)
          
          if (!response.success) {
            console.error(response.message)
            toast.error(response.message)
            return []
          }

          let results = (response.data || []).map(record => this.transformFromDatabase(record))
          
          // Apply client-side sorting
          results.sort((a, b) => {
            switch (sortBy) {
              case "popular":
                return (b.likes + b.views) - (a.likes + a.views)
              case "views":
                return b.views - a.views
              case "likes":
                return b.likes - a.likes
              case "recent":
              default:
                return new Date(b.createdAt) - new Date(a.createdAt)
            }
          })

          return results
      }

      // For specific field searches
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "html_c"}},
          {"field": {"Name": "css_c"}},
          {"field": {"Name": "javascript_c"}},
          {"field": {"Name": "thumbnail_c"}},
          {"field": {"Name": "author_name_c"}},
          {"field": {"Name": "author_avatar_c"}},
          {"field": {"Name": "author_id_c"}},
          {"field": {"Name": "views_c"}},
          {"field": {"Name": "likes_c"}},
          {"field": {"Name": "createdOn_c"}},
          {"field": {"Name": "updatedAt_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: where,
        pagingInfo: {"limit": 50, "offset": 0}
      }

      const response = await client.fetchRecords('pens_c', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      let results = (response.data || []).map(record => this.transformFromDatabase(record))
      
      // Apply client-side sorting
      results.sort((a, b) => {
        switch (sortBy) {
          case "popular":
            return (b.likes + b.views) - (a.likes + a.views)
          case "views":
            return b.views - a.views
          case "likes":
            return b.likes - a.likes
          case "recent":
          default:
            return new Date(b.createdAt) - new Date(a.createdAt)
        }
      })

      return results
    } catch (error) {
      console.error("Error searching pens:", error)
      toast.error("Search failed")
      return []
    }
  }

  async create(penData) {
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      // Transform to database format with only Updateable fields
      const dbData = this.transformToDatabase({
        ...penData,
        title: penData.title || "Untitled Pen",
        html: penData.html || "",
        css: penData.css || "",
        javascript: penData.javascript || "",
        thumbnail: penData.thumbnail || null,
        author: {
          name: "Anonymous", // TODO: Get from authenticated user
          avatar: null,
          id: "anonymous"
        },
        views: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      const params = {
        records: [dbData]
      }

      const response = await client.createRecord('pens_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pen created successfully!")
          return this.transformFromDatabase(successful[0].data)
        }
      }

      return null
    } catch (error) {
      console.error("Error creating pen:", error)
      toast.error("Failed to create pen")
      return null
    }
  }

  async update(id, penData) {
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      // Transform to database format with only Updateable fields
      const dbData = {
        Id: parseInt(id),
        ...this.transformToDatabase({
          ...penData,
          updatedAt: new Date().toISOString()
        })
      }

      const params = {
        records: [dbData]
      }

      const response = await client.updateRecord('pens_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pen updated successfully!")
          return this.transformFromDatabase(successful[0].data)
        }
      }

      return null
    } catch (error) {
      console.error("Error updating pen:", error)
      toast.error("Failed to update pen")
      return null
    }
  }

  async delete(id) {
    try {
      const client = this.ensureClient()
      if (!client) throw new Error('ApperClient not initialized')

      const params = {
        RecordIds: [parseInt(id)]
      }

      const response = await client.deleteRecord('pens_c', params)

      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          toast.success("Pen deleted successfully!")
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Error deleting pen:", error)
      toast.error("Failed to delete pen")
      return false
    }
  }

  async likePen(id) {
    try {
      // Get current pen to increment likes
      const pen = await this.getById(id)
      if (!pen) return null

      const updatedData = {
        likes: pen.likes + 1,
        updatedAt: new Date().toISOString()
      }

      return await this.update(id, updatedData)
    } catch (error) {
      console.error("Error liking pen:", error)
      return null
    }
  }

  async viewPen(id) {
    try {
      // Get current pen to increment views
      const pen = await this.getById(id)
      if (!pen) return null

      const updatedData = {
        views: pen.views + 1,
        updatedAt: new Date().toISOString()
      }

      return await this.update(id, updatedData)
    } catch (error) {
      console.error("Error incrementing pen views:", error)
      return null
    }
  }
}

export default new PenService()