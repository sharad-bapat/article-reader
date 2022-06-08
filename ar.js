function getArticleExtract(url) {
    $("#wpContent").html(``);
    async.tryEach([
        (next) => {
            Parse(`${url}`).then(data => {
                if (data.title) {
                    console.log(data);
                    source_url = new URL(url);
                    update_HTML(data, source_url);
                } else {
                    console.log(`Simple parsing did not work`);
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
                    console.log(data);
                    source_url = new URL(url);
                    update_HTML(data, source_url);
                   
                } else {
                    console.log(`CORS did not work`);
                    return next(new Error('Cannot get Data'))
                }
            }).catch(err => {
                console.log(err);
                return next(new Error('Cannot get Data'))
            })
        },        
    ])
    $("#loader").attr("style", "display:none");

}

function update_HTML(data, source_url) {
    $("#wpContent").append(`<img alt="${source_url.hostname}" class="mt-2 mb-3" src="https://www.google.com/s2/favicons?domain=${source_url.hostname}" /><span class="small"> ${source_url.hostname.replace("http://", "").replace("https://", "").replace("www.", "") }</span>`);
    $("#wpContent").append(`<h1>${data.title}</h1>`);
    if (data.date_published) {
        $("#wpContent").append(`<p class="small m-2">${data.date_published.split('T')[0]}</p>`);
    }    
    $("#wpContent").append(`<hr class="my-3"></hr>`);
    $("#wpContent").append(`<img src ="${data.lead_image_url} alt="" width='100%' height="auto" style="object-fit:cover" onerror='imgError(this)'/>`);
    $("#wpContent").append(`<p class="small">${data.content}<p>`);    
    $("#loader").attr("style", "display:none");
    $("#wpContent").show();
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
    $("#loader").attr("style", "display:block");
    //$("#wpContent").hide();
    getArticleExtract($("#input-url").val().trim());
}));
   

const queryString = window.location.search;
console.log(queryString);
const urlParams = new URLSearchParams(queryString);
const url = urlParams.get('url');
console.log(url);
if (url) {
    //$("#loader").attr("style", "block");
    $("#wpContent").hide();
    getArticleExtract(url.trim());
}
