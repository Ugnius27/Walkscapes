function attach_listener_to_element(source_id, fn_to_call) {
    let element = document.getElementById(source_id);
    element.addEventListener('htmx:afterRequest', function (event) {
        let source_element = event.detail.elt;
        if (source_element.id === source_id) {
            if (event.detail.successful) {
                fn_to_call();
            }
        }
        event.stopPropagation();
    })
}
