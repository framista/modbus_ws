export function validateHost(host) {
    if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(host.value)) {
        host.nextElementSibling.style.display = "none";
        return true
    }
    host.nextElementSibling.style.display = "block";
    return false
}

export function validateInputNumbers(input) {
    if (/^\d+$/.test(input.value)) {
        input.nextElementSibling.style.display = "none"
        return true
    }
    input.nextElementSibling.style.display = "block"
    return false
}


