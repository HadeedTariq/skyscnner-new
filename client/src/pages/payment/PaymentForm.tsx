import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Calendar as CalendarIcon,
  CreditCard,
  Lock,
  MapPin,
  Mail,
  User,
  Shield,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

const debitCardRegex =
  /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})$/;

const formSchema = z.object({
  paymentMethod: z.enum(["debit-card", "paypal"]),
  cardholderName: z.string().min(2, {
    message: "Cardholder name must be at least 2 characters.",
  }),
  cardNumber: z
    .string()
    .min(13, { message: "Card number is too short." })
    .max(19, { message: "Card number is too long." })
    .refine((val) => debitCardRegex.test(val.replace(/\s/g, "")), {
      message: "Please enter a valid card number.",
    }),
  expiryDate: z
    .date({
      error: "Expiry date is required.",
    })
    .refine((date) => date > new Date(), {
      message: "Expiry date must be in the future.",
    }),
  cvv: z
    .string()
    .min(3, { message: "CVV must be at least 3 digits." })
    .max(4, { message: "CVV must be at most 4 digits." })
    .refine((val) => /^\d+$/.test(val), {
      message: "CVV must contain only digits.",
    }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  address: z.string().min(1, { message: "Address is required." }),
  city: z.string().min(1, { message: "City is required." }),
  state: z.string().min(1, { message: "State is required." }),
  zipCode: z
    .string()
    .min(1, { message: "ZIP code is required." })
    .refine((val) => /^\d{5}(-\d{4})?$/.test(val), {
      message: "Please enter a valid ZIP code.",
    }),
  country: z.string().min(1, { message: "Country is required." }),
  savePaymentInfo: z.boolean().default(false),
});

export function PaymentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      paymentMethod: "debit-card",
      cardholderName: "",
      cardNumber: "",
      cvv: "",
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
      savePaymentInfo: false,
      expiryDate: new Date(),
    },
  });

  const formatCreditCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "");
    if (number.startsWith("4")) return "Visa";
    if (number.startsWith("5")) return "Mastercard";
    if (number.startsWith("3")) return "Amex";
    return "Card";
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsSubmitting(true);
  }

  return (
    <div className="mx-auto space-y-6">
      <div className="">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Secure Payment
              </h2>
              <p className="text-gray-600 mt-1">
                Complete your order with confidence
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 border-blue-300"
              >
                <Shield className="h-3 w-3 mr-1" />
                SSL Secured
              </Badge>
            </div>
          </div>

          <Card className="mb-6 border-blue-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-blue-600" />
                Billing Address
              </CardTitle>
              <CardDescription>
                Where should we send your receipt and billing information?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                            <Input
                              placeholder="your.email@example.com"
                              className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-blue-600" />
                              <Input
                                placeholder="John"
                                className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Street Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123 Main Street, Apt 4B"
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            City
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="New York"
                              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            State
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="NY"
                              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">
                            ZIP Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="10001"
                              className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">
                          Country
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="US">🇺🇸 United States</SelectItem>
                            <SelectItem value="CA">🇨🇦 Canada</SelectItem>
                            <SelectItem value="UK">
                              🇬🇧 United Kingdom
                            </SelectItem>
                            <SelectItem value="AU">🇦🇺 Australia</SelectItem>
                            <SelectItem value="DE">🇩🇪 Germany</SelectItem>
                            <SelectItem value="FR">🇫🇷 France</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </CardContent>
          </Card>

          <Tabs defaultValue="debit-card" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-100 border border-blue-200">
              <TabsTrigger
                value="debit-card"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger
                value="paypal"
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                PayPal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="debit-card">
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    Card Information
                  </CardTitle>
                  <CardDescription>
                    Your payment information is encrypted and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="cardholderName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Cardholder Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John Doe"
                                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium">
                                Card Number
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="4242 4242 4242 4242"
                                    className="pr-20 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                    {...field}
                                    onChange={(e) => {
                                      field.onChange(
                                        formatCreditCardNumber(e.target.value)
                                      );
                                    }}
                                    maxLength={19}
                                  />
                                  <div className="absolute right-3 top-2.5 flex items-center gap-2">
                                    <span className="text-xs text-blue-600 font-medium">
                                      {field.value && getCardType(field.value)}
                                    </span>
                                    <CreditCard className="h-4 w-4 text-blue-600" />
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-sm font-medium">
                                  Expiry Date
                                </FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          "w-full pl-3 text-left font-normal border-blue-200 focus:border-blue-400 focus:ring-blue-400",
                                          !field.value &&
                                            "text-muted-foreground"
                                        )}
                                      >
                                        {field.value ? (
                                          format(field.value, "MM/yyyy")
                                        ) : (
                                          <span>MM/YYYY</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date()}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium">
                                  CVV
                                </FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      placeholder="123"
                                      className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                                      {...field}
                                      maxLength={4}
                                      onChange={(e) => {
                                        const value = e.target.value.replace(
                                          /\D/g,
                                          ""
                                        );
                                        field.onChange(value);
                                      }}
                                    />
                                    <Lock className="absolute right-3 top-2.5 h-4 w-4 text-blue-600" />
                                  </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                  3-4 digits on the back of your card
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <FormField
                          control={form.control}
                          name="savePaymentInfo"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="border-blue-400 data-[state=checked]:bg-blue-500"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium">
                                  Save payment information
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Securely save this card for faster checkout
                                  next time
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing Payment...
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="h-4 w-4" />
                              Complete Secure Payment
                            </div>
                          )}
                        </Button>

                        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            256-bit SSL encryption
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            PCI DSS compliant
                          </div>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paypal">
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      Pay with PayPal
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      You'll be securely redirected to PayPal to complete your
                      payment using your PayPal account or any card.
                    </p>
                    <Button
                      className="w-full max-w-md h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      size="lg"
                    >
                      <div className="flex items-center gap-2">
                        Continue with PayPal
                        <Lock className="h-4 w-4" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
