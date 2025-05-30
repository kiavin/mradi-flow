export const useErrorRedirect = () => {
    const redirectOnError = (code, errorData = {}) => {
        const title = errorData.title || ''
        const description = errorData.description || ''
        const redirectUrl = errorData.redirectUrl || ''

        // window.location.href = `/ErrorPage?code=${code}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
        let url = `/ErrorPage?code=${code}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

        if (redirectUrl) {
            url += `&redirectUrl=${encodeURIComponent(redirectUrl)}`
        }

        window.location.href = url
    }

    return { redirectOnError }
}
