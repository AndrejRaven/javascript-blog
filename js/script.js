'use strict';

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


const optArticleSelector = '.post',
    optTitleSelector = '.post-title',
    optTitleListSelector = '.titles',
    optArticleTagsSelector = '.post-tags .list',
    optArticleAuthorSelector = '.post .post-author',
    optTagsListSelector = '.tags .list',
    optCloudClassCount = 5,
    optCloudClassPrefix = 'tag-size-';

function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(optTitleListSelector);
    titleList.innerHTML = '';
    /* for each article */
    const articles = document.querySelectorAll(optArticleSelector + customSelector);
    let html = "";
    for (let article of articles) {


        /* get the article id */
        const articleId = article.getAttribute('id');

        /* find the title element */
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;
        /* get the title from the title element */

        /* create HTML of the link */
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
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
    for(let tag in tags){
        params.max = Math.max(tags[tag], params.max);
        params.min = Math.min(tags[tag], params.min);
      }


    return params;  
}

 function calculateTagClass(count, params) {

     const normalizedCount = count - params.min;
     const normalizedMax = params.max - params.min;
     const percentage = normalizedCount / normalizedMax;
     const classNumber = Math.floor( percentage * (optCloudClassCount - 1) + 1 );
    
     return optCloudClassPrefix + classNumber;
    }

function generateTags(){
    /* [NEW] create a new variable allTags with an empty object */
    let allTags = {};
  
    /* find all articles */
    const articles = document.querySelectorAll(optArticleSelector);
    /* START LOOP: for every article: */
    for(let article of articles) {
      /* find tags wrapper */
      const tagsWrapper = article.querySelector(optArticleTagsSelector);
      /* make html variable with empty string */
        let html = '';
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
        for(let tag of articleTagsArray) {
        /* generate HTML of the link */
        const linkHTML = `<li><a href="#tag-${tag}">${tag}</a></li>`;
        /* add generated code to html variable */
        html = html + linkHTML;
        /* [NEW] check if this link is NOT already in allTags */
        if(!allTags.hasOwnProperty(tag)){
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
    

    for(let tag of Object.keys(allTags)) {
        allTagsHTML += `<li><a href="#tag-${tag}" class="${calculateTagClass(allTags[tag], tagsParams)}">${tag}</a></li>`;
        console.log(allTags[tag], tagsParams);
    }
    tagList.innerHTML = allTagsHTML;
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
    for(let link of tagLinks) {
    /* add tagClickHandler as event listener for that link */
        link.addEventListener('click', tagClickHandler);
    /* END LOOP: for each link */
    }
}

addClickListenersToTags();

function genereateAuthors() {
    const authors = document.querySelectorAll(optArticleSelector);
    for(let author of authors) {
        const authorWrapper = author.querySelector(optArticleAuthorSelector);
        let hmtl = '';
        const articleAuthor = author.getAttribute('data-author');
        authorWrapper.innerHTML = `<a href="#author-${articleAuthor}">${articleAuthor}</a>`;
    }
}

genereateAuthors();

function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const author = href.replace('#author-', '');
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for(let link of authorLinks) {
        link.classList.remove('active');
    }
    const hrefLinks = document.querySelectorAll(`a[href="${href}"]`);
    for(let link of hrefLinks) {
        link.classList.add('active');
    }
    generateTitleLinks(`[data-author="${author}"]`);
}

function addClickListenersToAuthors() {
    const authorLinks = document.querySelectorAll('a[href^="#author-"]');
    for(let link of authorLinks) {
        link.addEventListener('click', authorClickHandler);
    }
}

addClickListenersToAuthors();
