# Week 7 - Workshop 2 - Cookies

__Learning Outcomes__

- what are cookies and why are they used
- how to set and remove cookies using headers
- how to check whether a request contains a cookie or not

__Prerequisites__

Knowledge of the following:
- vanilla Node.js server
- `request` and `response` [objects](https://nodejs.org/api/http.html#http_class_http_incomingmessage))

- how to check whether a request contains a cookie or not

---

### Remembering the browser

So now that you know how to store a user's password safely, the question is: how does your server remember a browser?

A [cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) is a piece of data that your server, hosted on a certain domain (`localhost`, `google.com` etc) sends back to the browser, which the browser will then keep, and attach to every future request _to that domain_. An `amazon.com` cookie will not be attached to a request to an `ebay.com` domain, for example.

(If you open up DevTools, and go to the 'Application' tab you will be able to see all the cookies attached to the domain you are currently on.)

### How to use cookies

Cookies are attached to the server response using the `Set-Cookie` header.

In Node.js, you set headers using the `res.setHeader` and `res.writeHead` methods. (`setHeader` lets you set one header, `writeHead` lets you set your response code and multiple headers at the same time.)

(NB: All servers use headers to communicate with the browser, not just Node.js.)
```
res.setHeader('Set-Cookie', 'logged_in=true');

// OR

res.writeHead(200, { 'Set-Cookie': 'logged_in=true' });
```

:boom: WARNING :boom:

Here we are setting a very simple cookie with a key of `logged_in` and a value of `true`. It will do for now as we are focusing purely on how to transmit cookies, but in reality there are two problems.

1. If you have multiple users, there is no way of telling the difference between them.
2. There is NO SECURITY in place. Cookies can very easily be edited in Devtools. For example, if you have a cookie of `admin=false`, it is very easy to change that to `admin=true`! The different ways to protect cookies from tampering will be in workshop 3...

:star2: WARNING OVER :star2:

### Cookie flags
You can also add 'flags' to the cookie to header to enable certain behaviour. Some of the more important ones are:

Flag | Description
---|---
`HttpOnly` | This prevents browser JavaScript from accessing the cookie and stops the cookie being accessed in the event of an XSS attack. E.g. the attacker may to steal a client's cookies. With the cookies of the legitimate user at hand, the attacker can proceed to act as the user in his/her interaction with a website, impersonating the user - Identity theft!
`Secure` | This means the cookie will only be set over a HTTPS connection. This prevents a man-in-the-middle attack.
`Max-Age` | This sets the cookie lifetime in seconds.

More flags can be found [here](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie).

So to improve our cookie a bit we can try:
```
res.setHeader('Set-Cookie', 'logged_in=true; Secure; HttpOnly; Max-Age=9000');
```

### Reading cookies
Now every time that browser makes a request to your server, it will then send the cookie along with it:
```
req.headers.cookie; // 'logged_in=true'
```
This is what you will be looking for in order to grant users access, send back private information etc.

### Removing cookies
There are a couple of ways to delete a cookie:
1. Overwriting the value.
2. Setting the age to 0.

```
// Here we are doing both.
res.setHeader('Set-Cookie', 'logged_in=blah; Max-Age=0');
```

### Exercise

### Set up
+ Clone this repo
+ `$ cd exercise`
+ `$ node server.js`
+ Navigate to `localhost:3000`

You will see that `index.html` has three buttons, now you must implement the cookie logic on the server side:

_Note: Click on the relevant button to check that you have implemented the cookie logic correctly_

Endpoint | Action
---|---
`/login` | Should add a cookie and redirect to `/`
`/logout` | Should remove the cookie and redirect to `/`
`/auth_check` | Based on the validity of the cookie, should send back a 200 or 401 response, and an informative message!

---

__BONUS 3rd PARTY TRACKING SECTION:__
When you are on `foo.com`, requests to `foo.com` will not send your `bar.com` cookie to its server.

BUT, the JavaScript on `foo.com` can make a request to any server. And if the JavaScript makes an AJAX request to `bar.com`, and you have an existing `bar.com` cookie, it can identify you, and collect any information that is currently available to the JavaScript.

This means that every time you use a page that has 3rd party JavaScript running on it (Disqus comment box, Facebook comment box, random widget), this JavaScript has the capability to track you independently of the domain you are currently on. This can be disabled in some browsers by disabling 3rd party cookies.
