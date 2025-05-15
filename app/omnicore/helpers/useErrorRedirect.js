export const useErrorRedirect = () => {
    const redirectOnError = (code, errorData = {}) => {
        const title = errorData.title || ''
        const description = errorData.description || ''

        window.location.href = `/ErrorPage?code=${code}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`
    }

    return { redirectOnError }
}
