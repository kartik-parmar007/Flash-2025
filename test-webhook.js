#!/usr/bin/env node

// Test script to verify n8n webhook connectivity
// Run this with: node test-webhook.js

const FormData = require('form-data');
const fetch = require('node-fetch');
const fs = require('fs');

const WEBHOOK_URL = "http://10.173.159.118:5678/webhook-test/01358e77-0252-46c7-80f9-200524927bdc";

async function testWebhook() {
  console.log('🔍 Testing n8n webhook connection...');
  console.log('📍 URL:', WEBHOOK_URL);
  
  try {
    // Test 1: Basic connectivity
    console.log('\n1️⃣ Testing basic connectivity...');
    const pingResponse = await fetch(WEBHOOK_URL.replace('/webhook-test/', '/healthz'), {
      method: 'GET',
    });
    console.log('   Status:', pingResponse.status);
    
    // Test 2: Webhook endpoint
    console.log('\n2️⃣ Testing webhook endpoint...');
    const formData = new FormData();
    formData.append('test', 'connection test');
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
    });
    
    console.log('   Webhook Status:', response.status);
    console.log('   Response Headers:', response.headers.raw());
    
    const responseText = await response.text();
    console.log('   Response Body:', responseText);
    
    if (response.ok) {
      console.log('\n✅ Webhook is working correctly!');
    } else {
      console.log('\n❌ Webhook returned error:', response.status);
    }
    
  } catch (error) {
    console.log('\n❌ Connection failed:', error.message);
    console.log('\n🔧 Please check:');
    console.log('   • n8n is running on localhost:5678');
    console.log('   • Webhook URL is correct');
    console.log('   • No firewall blocking connections');
  }
}

// Run the test
testWebhook();