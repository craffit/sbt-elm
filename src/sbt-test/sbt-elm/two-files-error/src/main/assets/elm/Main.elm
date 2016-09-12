import Html exposing (Html)
import Html.App as App

import B exposing (..)

main : Program Never
main =
  App.beginnerProgram { model = model, view = B.view, update = update }

-- Model
type alias Model = Int

model : Model
model = 0

-- Update
type Msg = Increment | Decrement | Reset

update : Msg -> Model -> Model
update msg model =
  case msg of
    Increment -> model + 1
    Decrement -> model - 1
    Reset -> 0
