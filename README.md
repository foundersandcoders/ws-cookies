# Week 7 - Workshop 2 - Cookies

## !WORK IN PROGRESS!

__Learning Outcomes__

- what are cookies
- setting and removing cookies with headers

__npm packages__
- [cookie](http://npmjs.com/package/cookie)

__Exercises__

- implement a logged_in=true cookie on glitch

---

### Managing Users

Alright so now that you know how to store users passwords safely, now the question is: How do you know whether a user is actually logged in?

When you have decided, based on the information a user has sent in their request, a login form perhaps, you need a way to track this user so that they don't have re-authenticate them on every request. The simplest way to do that is with cookies.

A cookie is a piece of data that your server, hosted on a certain domain (localhost, google.com etc) sends back in the request response, that the users browser will then keep in browser and attach to every future request, but on that domain. An amazon.com cookie will not be attached to a request to an ebay.com domain.

__BONUS 3rd PARTY TRACKING SECTION:__
Related to the cookie domain point, when you are on `foo.com`, requests to `foo.com` will not send your `bar.com` cookie to its server, BUT the JavaScript on `foo.com`s page can make a request to any server. And if the JavaScript makes an AJAX request to `bar.com`, and you have an existing `bar.com` cookie, it can identify you, and collect any information that is currently available to the JavaScript.

This means that every time you use a page that has 3rd party JavaScript running on it (Disqus comment box, Facebook comment box, random widget), this JavaScript has the capability to track you independently of the domain you are currently on. This can be disabled in some browsers by disabling 3rd party cookies.

### How to use cookies

Cookies are attached to the server response using the `Set-Cookie` header.
[insert detailed cookie header explanation]

### Cookie flags etc
A standard `user_id=1` cookie naturally very insecure. This can be improved in 3 ways.
1. Enabling the `http-only` flag, which means that browser JavaScript cannot access the cookie, which prevents the cookie being accessed by an XSS attack.
2. Enabling the `secure` flag, which means the cookie will only be set on a HTTPS connection. This prevents a man in the middle attack.
