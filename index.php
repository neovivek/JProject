<?php
    session_start();
    if(isset($_SESSION['userid'])){
        header('Location: /home.php');
    }
?>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="/favicon.png">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <title>J Project | Search n Interact</title>

    <!-- Bootstrap core CSS -->
    <link href="/css/bootstrap.min.css" rel="stylesheet">
    <link href="/css/bootstrap-theme.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/css/jproject.css">
    <link rel="stylesheet" type="text/css" href="/css/main.css">
    <link rel="stylesheet" type="text/css" href="/css/font-awesome.css">
    <script src="/strophe.min.js"></script>
    <script src="js/jquery.min.js"></script>
    <script type="text/javascript" src="/js/main.js"></script>
</head>
<body>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <div class="header-left clearfix">
                <div class="logo smooth-scroll">
                    <a href="#banner"><img id="logo" src="/favicon.png" alt="J-project" width="50" height="auto"></a>
                </div>
                <div class="site-name-and-slogan smooth-scroll">
                    <div class="site-name">J Project</div>
                    <div class="site-slogan">Innovatoin and you</div>
                </div>
            </div>
            </div>
            <div class="navbar-collapse collapse">
                <ul class="nav navbar-right">
                    <li>
                        <form class="navbar-form" role="form" id="login-form" action="/php/newuser.php" method="POST">
                            <div class="form-group">
                                <input type="text" id="logno" name="name" placeholder="Mobile Number" class="form-control">
                            </div>
                            <div class="form-group">
                                <input type="password" id="logpass" name="pass" placeholder="Password" class="form-control">
                            </div>
                            <button type="submit" id="login" class="btn btn-primary">Sign in</button>
                        </form>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <div id="banner">
        <div class="banner-container">
            <div class="text-vcenter">
                <div class="container">
                    <h1>This Is J Project</h1>
                    <p class="lead text-center">Connect with people around you — and other fascinating people. Get updates on the people that interest you. And ask for help while helping others, in real time. And best part is that you don't have to reveal your identity, isn't it awesome.</p>
                    <p class="lead2 text-center">Connect with people around you — and other fascinating people. Get updates on the people and topics that interest you.</p>
                    <button type="button" id="signup" class="btn btn-lg btn-info center-block">Create Your Account</button>
                    <div class="dropdown-header" data-toggle="modal" data-target="#recover-container" data-whatever="" style="color: white; cursor: pointer; font-size: 19px; text-shadow: 2px 2px 9px rgba(255, 255, 255, 0.5); text-align: center; font-weight: bold;">Forgot Password</div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="recover-container" tabindex="-1" role="dialog" aria-labelledby="recoverymodal" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="recoverymodal">Enter Your Email Address To Recover The Password</h4>
          </div>
          <div class="modal-body">
              <div class="form-group has-feedback">
                <label for="recipient-name" class="control-label">Enter your Email Address:</label>
                <input type="email" class="form-control" id="recover" required="required">
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            <button type="button" id="recover-active" class="btn btn-primary">Recover Password</button>
          </div>
        </div>
      </div>
    </div>
    <div class="pad-section">
        <div class="container">
            <div class="page-header">
                <h1 class="text-center" id="contact">Contact Us</h1>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="footer-content">
                        <p class="large">If you guys have liked us and want to help us or provide support, then please contact us using the form given below and we will mail back you guys.</p>
                        <ul class="list-icons">
                            <li><i class="fa fa-map-marker pr-10"></i> YMCA UST, Faridabad</li>
                            <li><i class="fa fa-envelope-o pr-10"></i> vivek.malasi@hotmail.com</li>
                        </ul>
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="footer-content">
                        <form role="form" id="footer-form">
                            <div class="form-group has-feedback">
                                <label class="sr-only" for="name2">Name</label>
                                <input type="text" class="form-control" id="name2" placeholder="Name" name="name2" required>
                                <i class="fa fa-user form-control-feedback"></i>
                            </div>
                            <div class="form-group has-feedback">
                                <label class="sr-only" for="email2">Email address</label>
                                <input type="email" class="form-control" id="email2" placeholder="Enter email" name="email2" required>
                                <i class="fa fa-envelope form-control-feedback"></i>
                            </div>
                            <div class="form-group has-feedback">
                                <label class="sr-only" for="message2">Message</label>
                                <textarea class="form-control" rows="8" id="message2" placeholder="Message" name="message2" required></textarea>
                                <i class="fa fa-pencil form-control-feedback"></i>
                            </div>
                            <input type="submit" value="Send Your Response" class="btn btn-danger btn-block">
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <footer>
        <div class="subfooter">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <p class="text-center">Copyright © 2015 JProject.</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <script src="/js/bootstrap.min.js"></script>
    <script src="/js/docs.min.js"></script>
</body>
</html>