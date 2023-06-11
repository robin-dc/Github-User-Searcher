const inputUser = document.getElementById('input-user')
const searchBtn = document.getElementById('search-btn')
const followerBtn = document.getElementById('follower-btn')
const followingBtn = document.getElementById('following-btn')
const userContainer = document.getElementById('user-container')
const jsonContainer = document.getElementById('json-container')

let followerUrl;
let followingUrl;
let activeCommit;

const svg = `<img src="src/images/loader.svg"/>`

// ======================================================= MAIN DATA FETCHING ==========================================
async function getData(input){
    const response = await fetch(`https://api.github.com/users/${input}`)
    try{
        if(!response.ok){
            userError()
            jsonContainer.innerHTML = ""
            inputUser.value = ""
            followingUrl = ""
            followerUrl = ""
            removeBothColor()
        }
        else{
            const data = await response.json()
            renderUser(data)
        }
    }
    catch(error){
        alert(Error("Fetch Error"+ error.message))
    }

}

// =========================================== RENDER USER INFORMATION ON RIGHT SIDE ================================
function renderUser(user){
    const avatar = user.avatar_url
    const name = user.name
    const alias = user.login
    const bio = user.bio
    const location = user.location
    const followersCount = user.followers
    const followingCount = user.following
    const date = user.created_at
    const followers = user.followers_url
    const following = user.following_url
    const activity = user.updated_at
    const repos = user.repos_url

    const shortenDate = changeDate(date)
    const accountActivity = activeState(activity)

    // console.log("Account last updated: ", accountActivity)

    followerUrl = followers
    followingUrl = changeFollowingUrl(following)

    followerBtn.style.backgroundColor = '#6e40c9'
    renderFollow(followers)
    userContainer.innerHTML = `
        <img src="${avatar}" class="w-10 rounded-full z-10" alt="">
        <p class=" text-violet font-black">${name}</p>
        <p class=" text-[#808080d5] font-semibold">${bio}</p>
        <p class=" text-white font-semibold">${location}</p>
        <ul class="flex gap-1">
            <li class=" text-white font-semibold">Followers: ${followersCount}</li>
            <li class=" text-white font-semibold">Following: ${followingCount}</li>
        </ul>
        <p class="absolute top-[0.8rem] md:top-[1.5rem] left-[50%] translate-x-[-50%] text-4xl md:text-[5.1rem] font-black text-[#808080c0] leading-[1.15rem] md:leading-[3rem]">${alias}</p>
        <p class="absolute bottom-[0.5rem] md:bottom-1 left-1 font-semibold text-[#808080c0]">Date Created: <span class="text-lightOrange">${shortenDate}</span></p>`

    activityStatus(repos, accountActivity)
    inputUser.value = ""

}

// =========================================== RENDER FOLLOWS ON LEFT SIDE ============================================
async function renderFollow(follows){
    try{
        const response = await fetch(follows)

        if(!response.ok){
            followError()
            removeBothColor()
        }
        else{
            const data = await response.json()

            const followsArray = data.map(follow => {
                return `<div class="flex flex-col items-center gap-[4px] cursor-pointer" id="user-trigger" data-id="${follow.login}">
                            <img src="${follow.avatar_url}" class="w-5 rounded-full z-10" alt="">
                            <p class="font-medium text-[#a5d6ff]">${follow.login}</p>
                        </div>`
            })
            if(followsArray.length === 0){
                jsonContainer.innerHTML =  `
                <p class="absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-4xl md:text-[3rem] font-black text-[#6e40c9] text-center leading-[4.5rem] opacity-70">None</p>`
            }
            else{
                jsonContainer.innerHTML = followsArray.join("")
            }

            const userBtn = document.querySelectorAll('#user-trigger')

            userBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    userContainer.innerHTML = svg
                    followingBtn.style.backgroundColor = '#161b22'
                    getData(btn.dataset.id)
                })
            })
        }

    }
    catch(error){
        alert(error.message)
    }


}
// ================================================== ACTIVITY STATUS =================================================

async function activityStatus(repos, accountActivity){
    try{
        const response = await fetch(repos)
        const data = await response.json()

        const dates = data.map(repo => {
            return changeDate(repo.updated_at)
        })

       if(latestCommit(dates) || accountActivity){
            userContainer.innerHTML += `<div class="absolute bottom-[0.5rem] md:bottom-1 right-1 flex items-center">
                                            <p class=" font-semibold text-[#808080c0]" title="Based on Account Activity for the past 30 days">Account: <span class="text-green-500">Active</span></p>
                                            <span class="h-[0.8rem] w-[0.7rem] rounded-full bg-green-500 ml-[4px] mb-[2px]"> </span>
                                        </div>`
       }
       else{
            userContainer.innerHTML += `<div class="absolute bottom-[0.5rem] md:bottom-1 right-1 flex items-center">
                                            <p class=" font-semibold text-[#808080c0]" title="Based on Account Activity for the past 30 days">Account: <span class="text-red-500">Inactive</span></p>
                                            <span class="h-[0.8rem] w-[0.7rem] rounded-full bg-red-500 ml-[4px] mb-[2px]"> </span>
                                        </div>`
       }
    }
    catch(error){
        alert(error.message)
    }

}

// ================================================== HELPER FUNCTIONS =================================================
// SAMPLE DATES

// const dateArray = ['2023-05-21', '2023-03-10', '2023-01-06', '2023-05-29', '2023-05-21', '2023-05-21', '2023-01-06', '2023-05-21', '2023-05-26', '2023-05-21', '2023-01-06', '2023-05-04', '2023-05-21', '2023-01-06', '2023-05-29', '2023-05-21', '2023-05-21', '2023-03-31', '2023-05-21', '2023-01-06', '2023-05-26', '2023-04-10', '2023-05-21', '2023-05-21', '2023-01-06', '2023-05-21', '2023-05-21', '2023-05-21', '2023-05-21', '2023-05-21']

function latestCommit(dateArray){
    const initial = new Date(dateArray[0]);
    const date = dateArray.reduce((accum, item) => {
        let latest = new Date(item);
        if (latest > accum) {
            // console.log("Latest: ", latest)
            return new Date(latest)
        }
        else {
            // console.log(accum,' is still latest');
            return new Date(accum)
        }
    }, initial);

    // console.log("Latest Commit: ", formatDate(date))
    const formattedDate = formatDate(date)
    return activeState(formattedDate)
}

function activeState(state) {
    let currentDate = new Date()
    let lastUpdated = new Date(changeDate(state))
    let timeDifferenceInMilliseconds = currentDate.getTime() - lastUpdated.getTime();
    let span = Math.floor(timeDifferenceInMilliseconds / (1000 * 3600 * 24));

    return span < 30
}

function changeFollowingUrl(url){
    let newUrl = ""

    for(let i = 0; i < url.length; i++){
        if(url[i] === "{"){
            return newUrl
        }
        newUrl += url[i]
    }
}
function changeDate(date){
    let newDate = ""
    if(date.length === 10){
        return date
    }
    else{
        for(let i = 0; i < date.length; i++){
            if(date[i] === "T"){
                return newDate
            }
            newDate += date[i]
        }
    }

}
function formatDate(oldDate){
    const date = new Date(oldDate);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const newDate = year + '-' + month + '-' + day;
    return newDate
}
function removeBothColor(){
    followingBtn.style.backgroundColor = '#161b22'
    followerBtn.style.backgroundColor = '#161b22'
}

function addFollowerBtnColor(){
    followerBtn.style.backgroundColor = '#6e40c9'
    followingBtn.style.backgroundColor = '#161b22'
}

function addFollowingBtnColor(){
    followingBtn.style.backgroundColor = '#6e40c9'
    followerBtn.style.backgroundColor = '#161b22'
}

function followError(){
    jsonContainer.innerHTML =  `
    <p class="absolute top-[45%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-4xl md:text-[3rem] font-black text-[#6e40c9] text-center leading-[3.5rem] opacity-70">You must search the user</p>`
}

function userError(){
    userContainer.innerHTML = `
    <p class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-4xl md:text-[4.5rem] font-black text-[#808080c0] text-center leading-[4.5rem]">User Not Found</p>`
}


// ================================================== EVENT LISTENERS =================================================

followerBtn.addEventListener("click", function(){
    jsonContainer.innerHTML = svg
    if(followerUrl !== ""){
        renderFollow(followerUrl)
        addFollowerBtnColor()
    }
    else{
        followError()
    }
})
followingBtn.addEventListener("click", function(){
    jsonContainer.innerHTML = svg
    if(followingUrl !== ""){
        renderFollow(followingUrl)
        addFollowingBtnColor()
    }
    else{
        followError()
    }
})

searchBtn.addEventListener('click', function(e){
    e.preventDefault()
    if(inputUser.value === ""){
        followError()
    }
    else{
        userContainer.innerHTML = svg
        getData(inputUser.value)
        followingBtn.style.backgroundColor = '#161b22'
    }

})
