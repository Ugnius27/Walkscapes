use maud::{html, Markup, PreEscaped};

pub fn form_index(error_message: &str) -> Markup {
    html! {
        link rel="stylesheet" href="login_form.css" {}
        div.login-container {
            form
                // action=""
                method="post"
                {
                    div.form-group {
                        label for="password" {"Password"}
                        input id="password" name="password" required type="password" {}
                    }
                    div.form-group {
                        button {"Log In"}
                    }
                }
            @if !error_message.is_empty() {
                p style="color: red" {(error_message)}
            }

        }
    }
}

pub fn panel_index() -> Markup {
    html! {
        (PreEscaped(r#"
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta content="width=device-width, initial-scale=1.0" name="viewport">
                <title>Walkscapes admin panel</title>

                <link href="style.css" rel="stylesheet">
                <script src="../node_modules/htmx.org/dist/htmx.js"></script>
                <link href="../node_modules/leaflet/dist/leaflet.css" rel="stylesheet">
                <script src="../node_modules/leaflet/dist/leaflet.js"></script>
                <script src="../node_modules/leaflet-editable/src/Leaflet.Editable.js"></script>
            </head>
            <body>
            <script>
                document.body.addEventListener("htmx:responseError", function (event) {
                    let errorMessage = event.detail.message || 'An error occurred during the request.';
                    document.getElementById('result').innerHTML = errorMessage;
                });
            </script>

            <h1>Walkscapes Admin Panel</h1>
            <div id="result"></div>
            <div>
                <div id="map_container">
                    <div class="modal" id="polygon_modal">
                        <div class="modal-content" id="polygon_modal_content">
                            <p>...</p>
                            <button disabled>Delete</button>
                            <button disabled>Edit</button>
                        </div>
                    </div>
                    <div id="map"></div>
                </div>
                <div id="right_menu">
                    <ul hx-get="challenges-list" hx-headers='{"Accept": "text/html"}' hx-swap="outerHTML" hx-trigger="load"
                        id="challenges_list"></ul>
                    <div id="record-viewer">
                    </div>
                </div>
            </div>

            <script src="init.js"></script>
            <script src="challenges.js"></script>
            <script src="load_map.js"></script>
            <script src="polygon_editor.js"></script>
            <script src="htmx_utils.js"></script>
            <script src="polygon_modal.js"></script>
            <script src="record.js"></script>
            </body>
        "#))
    }
}