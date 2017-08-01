# Week 7 - Workshop 2 - Cookies

## !WORK IN PROGRESS!

__Learning Outcomes__

- what are cookies and why are they used
- how to check whether a request contains a cookie or not
- how to set and remove cookies using headers
- how to use the `cookie` npm package to build a cookie

---

### Remembering the browser

So now that you know how to store users passwords safely, now the question is: how does your server remember a user?

A cookie is a piece of data that your server, hosted on a certain domain (`localhost`, `google.com` etc) sends back to the browser, that the browser will then keep, and attach to every future request _to that domain_. An `amazon.com` cookie will not be attached to a request to an `ebay.com` domain, for example.

### How to use cookies

Cookies are attached to the server response using the `Set-Cookie` header. 

In Node.js, you set headers using the `res.setHeader` and `res.writeHead` methods.

(NB: All servers use headers to communicate with the browser, not just Node.js.)
```
res.setHeader('Set-Cookie', 'logged_in=true');

// OR

res.writeHead(200, { 'Set-Cookie', 'logged_in=true' });
```

Here we are setting a very simple cookie with a key of `logged_in` and a value of 'true'. In reality of course, every user would be given a different, unique cookie, but this will do for now.

### Cookie flags
You can also add 'flags' to the cookie to header to enable certain behaviour. Some of the more important ones are:

Flag | Description
---|---
`HttpOnly` | This prevents browser JavaScript cannot access the cookie, which stops the cookie being accessed in the event of an XSS attack.
`Secure` | This means the cookie will only be set over a HTTPS connection. This prevents a man-in-the-middle attack.
`Max-Age` | This sets the cookie lifetime in seconds.

More flags can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

So to improve our cookie a bit we can try:
```
res.setHeader('Set-Cookie', 'logged_in=true; Secure; HttpOnly; Max-Age=9000');
```

### Reading cookies
Now every time that browser makes a request to your server, it will the send the cookie along with it:
```
req.headers.cookie; // 'logged_in=true'
```
This is what you will be looking for in order to grant users access, send back private information etc.

### Removing cookies
There are a couple of ways to delete a cookie, 1. overwriting the value. 2. Setting the age to 0.
```
// Here we are doing both.
res.setHeader('Set-Cookie', 'logged_in=blah; Max-Age=0');
```

### Cookie npm package
As you can see this can be a bit cumbersome, so we can use the npm package '[cookie](https://www.npmjs.com/package/cookie)' to tidy it up a bit:
```
const { serialize } = require('cookie');

serialize('logged_in', 'true', { secure: true, httpOnly: true, maxAge: 9000 });
// 'logged_in=true; Max-Age=9000; HttpOnly; Secure'
```

Even more usefully, `cookie` can also be used to parse incoming cookies:
```
const { parse } = require('cookie');

const cookieHeader = req.headers.cookie;

parse(cookieHeader); // { logged_in: 'true' } 
```

### Exercise
1. Go to glitch. [link here]
2. Make 3 endpoints. One for logging in, one for logging out, and one for checking your login status.

__BONUS 3rd PARTY TRACKING SECTION:__
When you are on `foo.com`, requests to `foo.com` will not send your `bar.com` cookie to its server.

BUT, the JavaScript on `foo.com` can make a request to any server. And if the JavaScript makes an AJAX request to `bar.com`, and you have an existing `bar.com` cookie, it can identify you, and collect any information that is currently available to the JavaScript.

This means that every time you use a page that has 3rd party JavaScript running on it (Disqus comment box, Facebook comment box, random widget), this JavaScript has the capability to track you independently of the domain you are currently on. This can be disabled in some browsers by disabling 3rd party cookies.
