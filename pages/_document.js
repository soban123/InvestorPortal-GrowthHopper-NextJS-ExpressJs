import Document, { Head, Main, NextScript } from 'next/document';

export default class Mydoc extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta name='next app' desciption='First app' />

          <link href='bootstrap/dist/css/bootstrap.min.css' rel='stylesheet' />

          <link href='font-awesome/css/font-awesome.min.css' rel='stylesheet' />

          <link href='nprogress/nprogress.css' rel='stylesheet' />

          <link href='iCheck/skins/flat/green.css' rel='stylesheet' />

          <link
            href='google-code-prettify/bin/prettify.min.css'
            rel='stylesheet'
          />

          <link href='select2/dist/css/select2.min.css' rel='stylesheet' />

          <link href='switchery/dist/switchery.min.css' rel='stylesheet' />

          <link href='starrr/dist/starrr.css' rel='stylesheet' />

          <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet" />
          <link
            href='bootstrap-daterangepicker/daterangepicker.css'
            rel='stylesheet'
          />

          <link href='build/css/custom.min.css' rel='stylesheet' />

          <link
            rel='stylesheet'
            href='//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.css'
          />
          {/* <!-- jQuery --> */}
          <script src='jquery/dist/jquery.min.js'></script>
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* <!-- Bootstrap --> */}
          <script src='bootstrap/dist/js/bootstrap.bundle.min.js'></script>
          {/* <!-- FastClick --> */}
          <script src='fastclick/lib/fastclick.js'></script>
          {/* <!-- NProgress --> */}
          <script src='nprogress/nprogress.js'></script>
          {/* <!-- bootstrap-progressbar --> */}
          <script src='bootstrap-progressbar/bootstrap-progressbar.min.js'></script>
          {/* <!-- iCheck --> */}
          <script src='iCheck/icheck.min.js'></script>
          {/* <!-- bootstrap-daterangepicker --> */}
          <script src='moment/min/moment.min.js'></script>
          <script src='bootstrap-daterangepicker/daterangepicker.js'></script>
          {/* <!-- bootstrap-wysiwyg --> */}
          <script src='bootstrap-wysiwyg/js/bootstrap-wysiwyg.min.js'></script>
          <script src='jquery.hotkeys/jquery.hotkeys.js'></script>
          <script src='google-code-prettify/src/prettify.js'></script>
          {/* <!-- jQuery Tags Input --> */}
          <script src='jquery.tagsinput/src/jquery.tagsinput.js'></script>
          {/* <!-- Switchery --> */}
          <script src='switchery/dist/switchery.min.js'></script>
          {/* <!-- Select2 --> */}
          <script src='select2/dist/js/select2.full.min.js'></script>
          {/* <!-- Parsley --> */}
          <script src='parsleyjs/dist/parsley.min.js'></script>
          {/* <!-- Autosize --> */}
          <script src='autosize/dist/autosize.min.js'></script>
          {/* <!-- jQuery autocomplete --> */}
          <script src='devbridge-autocomplete/dist/jquery.autocomplete.min.js'></script>
          {/* <!-- starrr --> */}
          <script src='starrr/dist/starrr.js'></script>

          {/* <!-- morris.js --> */}
          <script src='raphael/raphael.min.js'></script>
          <script src='morris.js/morris.min.js'></script>

          <script src='//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'></script>
          <script src='//cdnjs.cloudflare.com/ajax/libs/raphael/2.1.0/raphael-min.js'></script>
          <script src='//cdnjs.cloudflare.com/ajax/libs/morris.js/0.5.1/morris.min.js'></script>

          {/* <!-- Custom Theme Scripts --> */}
          <script src={'./build/js/custom.min.js'}></script>

          <script src="https://cdn.quilljs.com/1.3.6/quill.js"></script>

          <script src={'/static/custom.js'}></script>
        </body>
        <style global jsx>
          {`
            body {
              margin: 0;
            }
            .adminPanel {
              color: skyblue;
              text-align: center;
            }

            .Footer {
              background: black;
              color: white;
              text-align: center;
              padding: 10px;
              height: 7vh;
              margin: auto;
            }

            .body {
              min-height: 90vh;
            }

            .modal-content {
              width: 120% !important;
            }
          `}
        </style>
      </html>
    );
  }
}
