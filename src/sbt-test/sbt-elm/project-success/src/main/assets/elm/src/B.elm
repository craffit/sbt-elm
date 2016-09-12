module B exposing (..)

import Html exposing (Html, button, div, text)
import Html.Events exposing (onClick)

type alias Model = Int
type Msg = Increment | Decrement | Reset

-- View
view : Model -> Html Msg
view model =
  div []
    [ button [ onClick Decrement ] [ text "-" ]
    , div [] [ text (toString model) ]
    , button [ onClick Increment ] [ text "+" ]
    , button [ onClick Reset ] [ text "Reset" ]
    ]
