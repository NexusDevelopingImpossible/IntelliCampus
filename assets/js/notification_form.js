// {
//     let createnoti = function(){
//         console.log('Hi');
//         let newNotiform = $('#createnotiid');
//         newNotiform.submit(function(e){
//             e.preventDefault();
//             $.ajax({
//                 type: 'notidata',
//                 url: '/admin/createnoti',
//                 data: newNotiform.serialize(),
//                 success: function(data){
//                     console.log(data);
//                 },
//                 error: function(error){
//                     console.log(error.responseText);
//                 }
//             })
//         })

//     } 
//     createnoti();
// }