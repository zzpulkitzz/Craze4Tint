import { useEffect, useState } from "react"

export default function Test() {
    let apiToken=import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN
    const fetchMoreProducts = async () => {
        
        
  
        try {
     
          const response = await fetch('https://ecf084-fb.myshopify.com/api/2024-01/graphql.json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Storefront-Access-Token': apiToken,
            },
    
            body: JSON.stringify({
                query: `query GetProductAllMetafields($cursor: String) {
                    products(first: 1, after: $cursor) {
                      edges {
                        node {
                          id
                          title
                          metafields(identifiers: [{namespace: "global", key: "color"}, {namespace: "product", key: "size"}]) {
                            value
                            type
                            namespace
                            key
                          }
                        }
                      }
                    }
                  }`,
                variables: {
                  cursor: null,
                  
                }
              }),
          });
    
          const {data} = await response.json();
          console.log(data)
        }  catch (error) {
            console.error("Error:", error);
            
          } finally {
           
          }
        };
        fetchMoreProducts()
    return (
        <div>
            dvs
        </div>
    );
}