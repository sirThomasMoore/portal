# Portal: a garage door application using Raspberry Pi

## Use Case

If you are absent-minded like me, I tend to leave the house and forget to close my garage door. I also hate keeping those blocky remotes on my person if I'm riding a motorcycle, or sometimes I even lock myself out of the house... What if you could setup a server for a resonable price, easy to install and you can open/close your garage door from anywhere?

## What it does

This Application is meant to be used on your mobile device (i.e., phone, tablet, etc.) as well as a browser on a PC. You can use it to open/close your garage from anywhere.

## This is a work in progress

This Application is currently a work in progress and is not ready for use in your home just yet. I too want to have this working in my garage.

## Initial Setup of your raspberry pi

This setup requires you to have Ubuntu Arm64 18.04 flavor of linux.

### This application requires the installation of the following:

    - docker, docker-compose

## Setup your node Application.

### To install and run:

`docker-compose up`

## Application Architecture

![Application Architecture](application-architecture/application-architecture.jpeg)

## How far are we?

The node-service is mostly there, this handles the rest calls and authentication for the application.

- I need unit tests implemented here

The python-service is mostly there, I still need to map the GPIO's to the code and detect if something is on or off and send the codes.

- I need unit tests implemented here

The UI is where it needs most of the work. I want to adhere to a material design approach for the application.
