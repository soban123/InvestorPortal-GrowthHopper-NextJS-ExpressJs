
     var quill = new Quill('#editor', {
          modules: {
               toolbar: [
                 [{ header: [1, 2, false] }],
                 ['bold', 'italic', 'underline'],
                 ['image', 'code-block']
               ]
             },
            
             theme: 'snow'  // or 'bubble'
       });

       
      //  var quill2 = new Quill('#editor-container', {
      //     modules: {
      //       toolbar: [
      //         [{ header: [1, 2, false] }],
      //         ['bold', 'italic', 'underline'],
      //         ['image', 'code-block']
      //       ]
      //     },
      //     placeholder: 'Compose an epic...',
      //     theme: 'snow'  // or 'bubble'
      //   });