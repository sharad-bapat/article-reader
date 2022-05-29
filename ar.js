function getArticleExtract(url) {
    $("#wpContent").html(``);
    async.tryEach([
        (next) => {
            Parse(`${url}`).then(data => {
                if (data.title) {
                    // console.clear()
                    $("#wpContent").append(`<h1>${data.title}</h1>`);
                    $("#wpContent").append(`<h2>${data.date_published}</h2>`);
                    $("#wpContent").append(`<img src ="${data.lead_image_url} alt="" width='100%' height="auto" style="object-fit:cover" onerror='imgError(this)'/>`);
                    $("#wpContent").append(`<p class="small">${data.content}<p>`);
                    $("#wpContent").append(`<p class="small d-flex-justify-content-center">Via: Normal Parse/<p>`);
                } else {
                    console.log(`Simple parsing did not work`);
                    return next(new Error('Cannot get Data'))
                }
            }).catch(err => {
                console.log(err);
                return next(new Error('Cannot get Data'))
            })
        },
        // (next) => {
        //     fetchURL(`https://api.outline.com/v3/parse_article?source_url=${url}`).then(data => {
        //         if (data.success) {
        //             data = data.data;
        //             if (data.data.site_name == "Outline") {
        //                 return next(new Error('Cannot get Data'))
        //             } else {
        //                 // console.clear()
        //                 let title = data.data.title ? data.data.title : ``;
        //                 let content = data.data.html ? data.data.html : ``;
        //                 let pageUrl = data.data.article_url ? data.data.article_url : ``;
        //                 let icon = data.data.icon ? data.data.icon : ``;
        //                 let author = data.data.author ? data.data.author : ``;
        //                 let siteName = data.data.site_name ? data.data.site_name : ``;
        //                 let date = data.data.date ? data.data.date : ``;
        //                 $("#wpContent").append(`<h1>${title}</h1>`);
        //                 $("#wpContent").append(`<h2>${date}</h2>`);
        //                 $("#wpContent").append(`<p class="small">${content}<p>`);
        //                 $("#wpContent").append(`<p class="small d-flex-justify-content-center">Via: Outline.com/<p>`);
        //             }

        //         } else {
        //             console.log(`Outline did not work`);
        //             return next(new Error('Cannot get Data'))
        //         }
        //     }).catch(err => {
        //         console.log(err);
        //         return next(new Error('Cannot get Data'))
        //     })
        // },
        (next) => {
            fetchURL(`https://api-panda.com/v2/feeds/story/full?url=${url}`).then(data => {
                if (data.success) {
                    // console.clear()
                    data = data.data;
                    console.log(data);
                    // console.log(data.data.data.title);
                    let title = data.data.title ? data.data.title : ``;
                    let content = data.data.html ? data.data.html : ``;
                    let pageUrl = data.data.pageUrl ? data.data.pageUrl : ``;
                    let icon = data.data.icon ? data.data.icon : ``;
                    let author = data.data.author ? data.data.author : ``;
                    let authorUrl = data.data.authorUrl ? data.data.authorUrl : ``;
                    let siteName = data.data.siteName ? data.data.siteName : ``;
                    let date = data.data.date ? new Date(data.data.date).toLocaleString("en-GB") : ``;
                    console.log(title,content,date);
                    $("#wpContent").append(`<h1>${title}</h1>`);
                    $("#wpContent").append(`<h2>${date}</h2>`);
                    $("#wpContent").append(`<p class="small">${content}<p>`);
                    $("#wpContent").append(`<p class="small d-flex-justify-content-center">Via: UsePanda.com/<p>`);
                } else {
                    console.log(`Pandas did not work`);
                    return next(new Error('Cannot get Data'))
                }
            }).catch(err => {
                console.log(err);
                return next(new Error('Cannot get Data'))
            })
        },

        (next) => {
            Parse(`https://sbcors.herokuapp.com/${url}`).then(data => {
                if (data.title) {
                    // console.clear()
                    $("#wpContent").append(`<h1>${data.title}</h1>`);
                    $("#wpContent").append(`<h2>${data.date_published}</h2>`);
                    $("#wpContent").append(`<img src ="${data.lead_image_url} alt="" width='100%' height="auto" style="object-fit:cover" onerror='imgError(this)'/>`);
                    $("#wpContent").append(`<p class="small">${data.content}<p>`);
                    $("#wpContent").append(`<p class="small d-flex-justify-content-center">Via: Proxy server/<p>`);
                } else {
                    console.log(`CORS did not work`);
                    return next(new Error('Cannot get Data'))
                }
            }).catch(err => {
                console.log(err);
                return next(new Error('Cannot get Data'))
            })
        },
        (next) => {
            fetchURL(`https://txtify.it/${url}`).then(data => {
                if (data.success) {

                } else {
                    // console.clear()
                    $("#wpContent").append(data.response);
                    $("#wpContent").append(`<p class="small d-flex-justify-content-center">Via: txtify.it/<p>`);
                }
            }).catch(err => {
                console.log(err);
                return next(new Error('Cannot get Data'))
            })
        },
    ])
    $("#loader").attr("style", "none");

}

async function fetchURL(url) {
    const response = await fetch(url);
    const text = await response.text();
    try {
        const data = JSON.parse(text);
        console.log({ success: 1, urlfetched: url, data: data })
        return { success: 1, urlfetched: url, data: data }
    } catch (err) {
        console.log({ success: 0, urlfetched: url, data: data })
        return { success: 0, urlfetched: url, error: err, response: text }
    }
}

function imgError(image) {
    $(image).hide();
}

$("#button-analyze").on("click", (function (e) { 
    e.preventDefault();
    $("#loader").attr("style", "block");
    $("#wpContent").hide();
    getArticleExtract($("#input-url").val().trim());
}));
   

