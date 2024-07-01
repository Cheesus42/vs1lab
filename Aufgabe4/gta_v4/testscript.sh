#!/bin/bash

BASE_URL="http://localhost:3000/api/geotags"

# Function to pretty print JSON using jq
pretty_json() {
    echo "$1" | jq .
}

# Function to get all tags
get_tags() {
    echo "Fetching all tags..."
	echo "curl $BASE_URL"
    RESPONSE=$(curl -s "$BASE_URL")
    pretty_json "$RESPONSE"
    echo -e "\n"
}

# Function to post a new tag
post_tag() {
    echo "Posting a new tag..."
	echo "curl -s -X POST -H "Content-Type: application/json" \
         -d '{"latitude":49.0,"longitude":8.3,"name":"Best Tag","hashtag":"\#cool"}' \
         "$BASE_URL""
    RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"latitude":49.0,"longitude":8.3,"name":"Best Tag","hashtag":"#cool"}' "$BASE_URL")
    echo "Response from POST:"
    pretty_json "$RESPONSE"
    echo -e "\n"
    
    # Extracting the DATA of the created tag from the response
    TAG_ID=$(echo "$RESPONSE" | jq -r '.id')
	TAG_NAME=$(echo "$RESPONSE" | jq -r '.name')
	TAG_LONG=$(echo "$RESPONSE" | jq -r '.longitude')
	TAG_LAT=$(echo "$RESPONSE" | jq -r '.latitude')
}

# Function to get tag by ID
get_tag_by_id() {
    echo "Fetching the created tag by ID (ID: $TAG_ID)..."
	echo "curl -s "$BASE_URL/$TAG_ID""
    RESPONSE=$(curl -s "$BASE_URL/$TAG_ID")
    pretty_json "$RESPONSE"
    echo -e "\n"
}

# Function to update the tag
update_tag() {
    echo "Updating the tag (ID: $TAG_ID)..."
	echo "curl -s -X PUT -H "Content-Type: application/json" -d '{"id":'"$TAG_ID"',"latitude":8.76,"longitude":49.1,"name":"Worst Tag","hashtag":"\#meh"}' "$BASE_URL/$TAG_ID""
    RESPONSE=$(curl -s -X PUT -H "Content-Type: application/json" \
         -d '{"id":'"$TAG_ID"',"latitude":8.76,"longitude":49.1,"name":"Worst Tag","hashtag":"#meh"}' \
         "$BASE_URL/$TAG_ID")
    echo "Response from PUT:"
    pretty_json "$RESPONSE"
    echo -e "\n"
}

# Function to delete the tag
delete_tag() {
    echo "Deleting the tag (ID: $TAG_ID)..."
	echo "curl -s -X DELETE "$BASE_URL/$TAG_ID""
    RESPONSE=$(curl -s -X DELETE "$BASE_URL/$TAG_ID")
    echo "Response from DELETE:"
    pretty_json "$RESPONSE"
    echo -e "\n"
}

get_tag_by_name_long_lat(){
	echo "Fetching the tag (search-term=$TAG_NAME, longitude=$TAG_LONG, latitude=$TAG_LAT, radius=10)..."
	echo "curl -s -G "http://localhost:3000/api/geotags" --data-urlencode "search-term=$TAG_NAME" --data-urlencode "longitude=$TAG_LONG" --data-urlencode "latitude=$TAG_LAT" --data-urlencode "radius=10""
	RESPONSE=$(curl -s -G "http://localhost:3000/api/geotags" --data-urlencode "search-term=$TAG_NAME" --data-urlencode "longitude=$TAG_LONG" --data-urlencode "latitude=$TAG_LAT" --data-urlencode "radius=10")
	pretty_json "$RESPONSE"
}

# Execute all functions
get_tags
post_tag
get_tag_by_id
get_tag_by_name_long_lat
update_tag
delete_tag
get_tags

