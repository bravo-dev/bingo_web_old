# 設計

## データ設計

```puml
@startuml

entity User {
    id
    ---
    name
    code
}

entity Bingo {
    id
    ---
    name
    code
    owner_id (user_id)
}

entity Sheet {
    id
    ---
    bingo_id
    user_id
}

entity BingoItem {
    id
    ---
    bingo_id
    text
    image_url
}

entity SheetItem {
    id
    ---
    sheet_id
    bingo_item_id
    is_active
    square_number
}

Bingo ||--o{ Sheet
Sheet ||--|| User
Bingo ||--|| User
Bingo ||--|{ BingoItem
Sheet ||--|{ SheetItem
BingoItem ||--|{ SheetItem

@enduml
```