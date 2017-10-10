function sendMessage() {
    var message = $('input[name=message]').val();
    socket.emit("bid", message);
}



function addPost() {
    var author = $('input[name=author]').val();
    // var description = $('input[name=description]').val();
    var description = document.getElementById("description").value;
    var title = $('input[name=title]').val();
    var file = $('input[name=file]')[0].files;

    var obj ={
        author: author,
        description: description,
        title: title
    };
    if (file.length) {
        obj.file = file;
    }

    $.ajax({
        url: "/newBlog",
        type:"post",
        data: JSON.stringify(obj),
        success:function(response){
            if(response) {
                window.location.reload();
            }
        }
    })
}

function removePost(postId) {
    var posts = document.getElementById('posts');

    $.ajax({
        url: "/deleteBlog/" + postId,
        type:"delete",
        success:function(response){
            if(response == "ok") {
                window.location.reload();
            }
        }
    })

}

//Edit Post

function editPost() {
    var author = $('input[name=author]').val();
    // var description = $('input[name=description]').val();
    var description = document.getElementById("description").value;
    var title = $('input[name=title]').val();
    var file = $('input[name=file]')[0].files;

    var obj ={
        author: author,
        description: description,
        title: title
    };

    $.ajax({
        url: "/editBlog",
        type:"put",
        data: obj,
        success:function(response){
            if(response) {
                window.location.reload();
            }
        }
    })
}