export async function fetchPlease(type,search,cursor){
    const PRODUCTS_PER_PAGE = 12;
    let apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    if(type===null){
        try{
       
      const response = await fetch('https://ecf084-fb.myshopify.com/api/2024-01/graphql.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': apiToken,
        },

        body: JSON.stringify({
            query: `query GetProducts($cursor: String, $search:String) {
              products(
                first:${PRODUCTS_PER_PAGE} , 
                after: $cursor,
                sortKey:CREATED_AT
                query: $search
                reverse: true
              ) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                  node {
                    id
                    title
                    handle
                    tags
                    description
                    metafield(namespace: "shopify", key: "color-pattern") {
                      value
                  
                    }
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                    variants(first: 20) {
                      edges {
                        node {
                          id
                          title
                          selectedOptions {
                            name
                            value
                          }
                          compareAtPrice {
                            amount
                          }
                          price {
                            amount
                          }
                          availableForSale
                        }
                      }
                    }
                    options {
                      name
                      values
                    }
                  }
                }
              }
            }`,
            variables: {
              cursor: cursor,
              search
            }
          }),
      });
      console.log(response)
      let {data}=await response.json()
      console.log(data)
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }
      return data

        }catch(error){
            return error
        }
    }
    else{
        try{
       
            const response = await fetch('https://ecf084-fb.myshopify.com/api/2024-01/graphql.json', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': apiToken,
              },
      
              body: JSON.stringify({
                  query: `query GetProducts($cursor: String,$collectionHandle:String) {
                    collection(handle: $collectionHandle) {
                        id
                        title
                    products(
                      first:${PRODUCTS_PER_PAGE} , 
                      after: $cursor,
                      
                    ) {
                      pageInfo {
                        hasNextPage
                        endCursor
                      }
                      edges {
                        node {
                          id
                          title
                          handle
                          tags
                          description
                          metafield(namespace: "shopify", key: "color-pattern") {
                            value
                        
                          }
                          priceRange {
                            minVariantPrice {
                              amount
                              currencyCode
                            }
                          }
                          images(first: 1) {
                            edges {
                              node {
                                url
                                altText
                              }
                            }
                          }
                          variants(first: 20) {
                            edges {
                              node {
                                id
                                title
                                selectedOptions {
                                  name
                                  value
                                }
                                compareAtPrice {
                                  amount
                                }
                                price {
                                  amount
                                }
                                availableForSale
                              }
                            }
                          }
                          options {
                            name
                            values
                          }
                        }
                      }
                    }
                    }
                  }`,
                  variables: {
                    cursor: cursor,
                    collectionHandle:type
                  }
                }),
            });
            let {data}=await response.json()
            console.log(data)
            if (data.errors) {
                throw new Error(data.errors[0].message);
              }
            return data.collection
      
              }catch(error){
                  return error
              }
    }

}
