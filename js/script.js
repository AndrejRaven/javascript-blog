'use strict';
const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
}

const opts = {
    tagSizes: {
        count: 5,
        classPrefix: 'tag-size-',
    },
};

const select = {
    all: {
        articles: '.post',
        linksTo: {
            tags: 'a[href^="#tag-"]',
            authors: 'a[href^="#author-"]',
        },
    },
    article: {
        tags: '.post-tags .list',
        author: '.post-author',
        postTitle: '.post-title'
    },
    listOf: {
        titles: '.titles',
        tags: '.tags.list',
        authors: '.authors.list',
    },
};

function titleClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    /*[DONE] remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
        activeLink.classList.remove('active');
    }
    clickedElement.classList.add('active');
    /*[DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts article.active');

    for (let activeArticle of activeArticles) {
        activeArticle.classList.remove('active');
    }
    /*[DONE] get 'href' attribute from the clicked link */
    const hrefAtrr = clickedElement.getAttribute('href');
    /*[DONE] find the correct article using the selector (value of 'href' attribute) */
    const neededArticle = document.querySelector(hrefAtrr);
    /*[DONE] add class 'active' to the correct article */
    neededArticle.classList.add("active");

}


function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    let html = "";
    for (let article of articles) {


        /* get the article id */
        const articleId = article.getAttribute('id');

        /* find the title element */
        const articleTitle = article.querySelector(select.article.postTitle).innerHTML;
        /* get the title from the title element */

        /* create HTML of the link */
        const linkHTMLData = { id: articleId, title: articleTitle };
        const linkHTML = templates.articleLink(linkHTMLData);
        // console.log(linkHTML);
        /* insert link into titleList */
        html = html + linkHTML;
    }
    titleList.innerHTML = html;
    const links = document.querySelectorAll('.titles a');
    for (let link of links) {
        link.addEventListener('click', titleClickHandler);
    }
}

generateTitleLinks();

let burgerMenu = document.querySelector('.burger'),
    navLinks = document.querySelector('.titles');

burgerMenu.addEventListener('click', () => {
    if (navLinks.style.display === "none" || navLinks.style.display === '') {
        navLinks.style.display = "block";
        const links = document.querySelectorAll('.titles a');
        for (let link of links) {
            link.addEventListener('click', () => {
                navLinks.style.display = 'none';
            });
        }
    } else {
        navLinks.style.display = "none";
    }
});


function calculateTagsParams(tags) {
    const params = {
        max: 0,
        min: 99999
    }
    for (let tag in tags) {
        params.max = Math.max(tags[tag], params.max);
        params.min = Math.min(tags[tag], params.min);
    }


    return params;
}

function calculateTagClass(count, params) {

    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);

    return opts.tagSizes.classPrefix + classNumber;
}

function generateTags() {
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
    const allTagsData = {tags: []};

    /* find all articles */
    const articles = document.querySelectorAll(select.all.articles);
    /* START LOOP: for every article: */
    for (let article of articles) {
        /* find tags wrapper */
        const tagsWrapper = article.querySelector(select.article.tags);
        /* make html variable with empty string */
        let html = '';
        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        /* START LOOP: for each tag */
        for (let tag of articleTagsArray) {
            /* generate HTML of the link */
            const linkHTMLData = { id: `tag-${tag}`, title: tag };
            const linkHTML = templates.tagLink(linkHTMLData);
            /* add generated code to html variable */
            html = html + linkHTML;
            /* [NEW] check if this link is NOT already in allTags */
            if (!allTags.hasOwnProperty(tag)) {
                /* [NEW] add generated code to allTags array */
                allTags[tag] = 1;
            } else {
                allTags[tag]++;
            }

            /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        tagsWrapper.innerHTML = html;
        /* END LOOP: for every article: */
    }
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector('.tags');
    let allTagsHTML = '';

    const tagsParams = calculateTagsParams(allTags);


    for (let tag of Object.keys(allTags)) {
        allTagsData.tags.push({
            tag: tag,
            count: allTags[tag],
            className: calculateTagClass(allTags[tag], tagsParams)
          });

    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
}

generateTags();

function tagClickHandler(event) {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const tagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let link of tagLinks) {
        /* remove class active */
        link.classList.remove('active');
        /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const hrefLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let link of hrefLinks) {
        /* add class active */
        link.classList.add('active');
        /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
}


function addClickListenersToTags() {
    /* find all links to tags */
    const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for (let link of tagLinks) {
        /* add tagClickHandler as event listener for that link */
        link.addEventListener('click', tagClickHandler);
        /* END LOOP: for each link */
    }
}

addClickListenersToTags();


function calculateAuthorsParams(authors) {
    const params = {
        max: 0,
        min: 99999
    }
    for (let author in authors) {
        params.max = Math.max(authors[author], params.max);
        params.min = Math.min(authors[author], params.min);
    }


    return params;
}

function calculateAuthorClass(count, params) {

    const normalizedCount = count - params.min;

    const normalizedMax = params.max - params.min;

    const percentage = normalizedCount / normalizedMax;
    let classNumber;
    if (percentage > 0.5) {
        classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 1);
    } else {
        classNumber = Math.floor(percentage * (opts.tagSizes.count - 1) + 2);
    }
    return opts.tagSizes.classPrefix + classNumber;

}

function genereateAuthors() {
    let allAuthors = {};
    const allAuthorsData = {authors: []};

    const articles = document.querySelectorAll(select.all.articles);
    for (let article of articles) {
        const authorWrapper = article.querySelector(select.article.author);
        let html = '';
        const articleAuthor = article.getAttribute('data-author');

        const linkHTMLData = { id: `author-${articleAuthor}`, title: articleAuthor };
            const linkHTML = templates.authorLink(linkHTMLData);

        html = html + linkHTML;

        if (!allAuthors.hasOwnProperty(articleAuthor)) {
            allAuthors[articleAuthor] = 1;
        } else {
            allAuthors[articleAuthor]++;

        }
        authorWrapper.innerHTML = html;
    }

    const authorList = document.querySelector('.authors');

    let allAuthorsHTML = '';

    const authorParams = calculateAuthorsParams(allAuthors);

    for (let author of Object.keys(allAuthors)) {
        allAuthorsData.authors.push({
            author: author,
            count: allAuthors[author],
            className: calculateAuthorClass(allAuthors[author], authorParams)
          });
    }

    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
}

genereateAuthors();

function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for (let link of authorLinks) {
        link.classList.remove('active');
    }
    const hrefLinks = document.querySelectorAll(`a[href="${href}"]`);
    for (let link of hrefLinks) {
        link.classList.add('active');
    }
    generateTitleLinks(`[data-author="${author}"]`);
}

function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for (let link of authorLinks) {
        link.addEventListener('click', authorClickHandler);
    }
}

addClickListenersToAuthors();
