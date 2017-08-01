# Week 7 - Workshop 2 - Cookies

## !WORK IN PROGRESS!

__Learning Outcomes__

- what are cookies and why are they used
- how to check whether a request contains a cookie or not
- how to set and remove cookies using headers
- how to use the `cookie` npm package to build a cookie

---

### Remembering the browser

Alright so now that you know how to store users passwords safely, now the question is: how does your server remember a user?

A cookie is a piece of data that your server, hosted on a certain domain (localhost, google.com etc) sends back, that the users browser will then keep and attach to every future request, but only to that domain. An amazon.com cookie will not be attached to a request to an ebay.com domain, for example.

### How to use cookies

Cookies are attached to the server response using the `Set-Cookie` header.

You set headers in Node.js using the `res.setHeader` and `res.writeHead` methods.

If a user has successfully authenticated with a server, you can instruct their browser to add a cookie using:
```
res.setHeader('Set-Cookie', 'logged_in=true');

// OR

res.writeHead(200, { 'Set-Cookie', 'logged_in=true' });
```

### Cookie flags
You can also add 'flags' to the cookie to header to enable certain behaviour. Some of the more important ones are:
Flag | Description | Example
---|---|---
`HttpOnly` | means that browser JavaScript cannot access the cookie, which prevents the cookie being accessed by an XSS attack | yeh
`Secure` | means the cookie will only be set on a HTTPS connection. This prevents a man in the middle attack. | yo
`Max-Age` | means the cookie will only be set on a HTTPS connection. This prevents a man in the middle attack. | yo

More can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

So to improve our cookie a bit we can try:
```
res.setHeader('Set-Cookie', 'logged_in=true; Secure; HttpOnly; Max-Age=9000');
```

### Reading cookies
Now every time that browser makes a request to your server, it will the send the cookie along with it:
```
req.headers.cookie; // 'logged_in=true'
```
This is what you will be looking for in order to grant users access, send back private information etc. In reality however every user will be given a different cookie, but this will do for now.

### Removing cookies
There are a couple of ways to delete a cookie, 1. overwriting the value. 2. Setting the age to 0.
```
// Here we are doing both.
res.setHeader('Set-Cookie', 'logged_in=blah; Max-Age=1');
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